// CarDeck.jsx
// ---------------------------------------------------------------------------
// Phase 3 — turn the card into an actual deck.
//
// Visual model:
//   The deck is a small stack. The top card is interactive (drag/swipe),
//   the next two are visible behind it scaled down and translated up so the
//   user reads "there's more under this".
//
// Interaction:
//   - Drag the top card horizontally with Framer Motion.
//   - Past a swipe threshold (offset OR velocity), the card flies off in the
//     direction of the swipe and the deck advances.
//   - At end of deck we loop. Phase 3 decision: simplest UX, keeps the
//     interaction infinite while the catalog is still small.
//
// Why position: absolute on every card?
//   So all cards share the same footprint. The container's height collapses
//   to whatever the top card needs (we measure once), and cards behind don't
//   push layout around.
// ---------------------------------------------------------------------------

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CarCard } from "./CarCard";

// How far / fast the user has to swipe to commit to the next card.
const SWIPE_OFFSET_THRESHOLD = 100; // px
const SWIPE_VELOCITY_THRESHOLD = 500; // px/s

// Visual depth for cards behind the top one. Index 0 = top, 1 = next, etc.
function depthStyle(depth) {
  if (depth === 0) {
    return { scale: 1, y: 0, opacity: 1 };
  }
  // Each step back: smaller, lifted up a bit, faded out.
  return {
    scale: 1 - depth * 0.05,
    y: -depth * 12,
    opacity: depth >= 3 ? 0 : 1 - depth * 0.15,
  };
}

// Swipe affordance pinned to the top of the viewport, where there's empty
// breathing space above the centred card. Renders only until the user has
// swiped once — the hint exists to bootstrap discovery and would just be
// chrome after that.
function SwipeHint() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      className="fixed left-0 right-0 text-center pointer-events-none z-50"
      // Sit below the iOS notch / status bar where present.
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
    >
      <motion.span
        className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/55"
        animate={{ x: [-3, 3, -3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span aria-hidden="true">←</span>
        swipe
        <span aria-hidden="true">→</span>
      </motion.span>
    </motion.div>
  );
}

export function CarDeck({ cars, onSelect }) {
  // `index` points at the top card. We never mutate `cars`; we just rotate
  // through it modulo length.
  const [index, setIndex] = useState(0);
  // Direction of the most recent swipe — feeds the exit animation.
  const [exitDirection, setExitDirection] = useState(0);
  // Has the user committed at least one swipe? Used to retire the hint.
  const [hasSwiped, setHasSwiped] = useState(false);

  if (!cars.length) return null;

  // We render the top card plus the two behind it. Anything deeper is
  // wasted DOM (it's invisible per depthStyle).
  const visibleDepth = Math.min(3, cars.length);
  const visible = Array.from({ length: visibleDepth }, (_, depth) => {
    const carIndex = (index + depth) % cars.length;
    return { car: cars[carIndex], depth, key: `${cars[carIndex].id}-${index + depth}` };
  });

  // Top card finished its drag — decide whether to commit or snap back.
  function handleDragEnd(_, info) {
    const { offset, velocity } = info;
    const swipedFarEnough = Math.abs(offset.x) > SWIPE_OFFSET_THRESHOLD;
    const swipedFastEnough = Math.abs(velocity.x) > SWIPE_VELOCITY_THRESHOLD;
    if (swipedFarEnough || swipedFastEnough) {
      setExitDirection(offset.x > 0 ? 1 : -1);
      setIndex((i) => (i + 1) % cars.length);
      setHasSwiped(true);
    }
  }

  return (
    // Sized like the card itself (max-w-[420px]) so the stack stays centred.
    // min-h matches roughly the card's height — keeps layout stable as the
    // top card exits.
    <div className="relative w-full max-w-[420px] mx-auto" style={{ minHeight: 600 }}>
      {/* Swipe affordance — disappears for good after the first commit */}
      <AnimatePresence>
        {!hasSwiped && <SwipeHint key="swipe-hint" />}
      </AnimatePresence>

      {/* Render bottom-up so the top card paints last (CSS stacking). */}
      {[...visible].reverse().map(({ car, depth, key }) => {
        const isTop = depth === 0;
        const target = depthStyle(depth);

        // Cards behind the top one are static — no drag, no exit animation.
        if (!isTop) {
          return (
            <motion.div
              key={key}
              className="absolute inset-0"
              initial={false}
              animate={target}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              style={{ pointerEvents: "none" }}
            >
              <CarCard car={car} onSelect={onSelect} />
            </motion.div>
          );
        }

        // Top card: draggable, with exit animation when committed.
        return (
          <AnimatePresence key="top-slot" custom={exitDirection} mode="popLayout">
            <motion.div
              key={key}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={handleDragEnd}
              // Tap-to-open lives on a dedicated button inside CarCard, NOT
              // here — putting onTap on the same motion.div as drag causes
              // both onTap and onDragEnd to fire on a successful swipe.
              style={{ touchAction: "pan-y" }}
              whileTap={{ cursor: "grabbing" }}
              // Match depth=1 styling on enter so the next card looks like it
              // was *promoted* from behind, not faded in from thin air.
              initial={depthStyle(1)}
              animate={target}
              exit={(direction) => ({
                x: direction * 600,
                y: 40,
                rotate: direction * 18,
                opacity: 0,
                transition: { duration: 0.35, ease: [0.4, 0.0, 0.2, 1] },
              })}
              custom={exitDirection}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <CarCard car={car} onSelect={onSelect} />
            </motion.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
}

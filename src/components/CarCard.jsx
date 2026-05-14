// CarCard.jsx
// ---------------------------------------------------------------------------
// Phase 4 — slimmed character-select tile.
//
// The card carries: type badge + origin flag, name + variant, hero photo over
// the accent halo, hexagon, and a chunky "See details" button beneath the
// hex. The button is the dedicated tap target for opening the detail view;
// the surrounding card surface is the draggable area (drag handlers live in
// CarDeck). Separating these gestures avoids the Framer-Motion gotcha where
// `onTap` and `onDragEnd` on the same element both fire on a successful
// swipe.
//
// The full stat readout that used to live on this card has moved to the
// detail view in Phase 4. See PHASE-4-NOTES.md.
//
// layoutIds on the photo container and the hexagon wrapper drive the
// shared-element morph between the card and the detail view.
// ---------------------------------------------------------------------------

import { useState } from "react";
import { motion } from "framer-motion";
import { StatHexagon } from "./StatHexagon";

// Chunky, accent-coloured pill button beneath the hexagon. Native gesture
// disambiguation handles tap-vs-drag: pressing the button starts a potential
// click, but if pointer movement exceeds the drag threshold the parent's
// drag engages and the click is cancelled by the browser/Framer.
function TapCue({ accentColor, onSelect }) {
  return (
    <div className="flex justify-center pb-5 pt-1">
      <motion.button
        type="button"
        onTap={() => onSelect?.()}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2.5 px-6 py-3 rounded-full text-[12px] font-black uppercase tracking-[0.2em]"
        style={{
          background: accentColor,
          color: "#0a0d14",
          // Coloured glow under the button — gives it lift in the game-y
          // visual register without falling back to a generic grey shadow.
          boxShadow: `0 6px 24px -8px ${accentColor}80`,
        }}
      >
        See details
        <motion.svg
          width="10"
          height="12"
          viewBox="0 0 8 14"
          fill="none"
          aria-hidden="true"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M1 1l5 6-5 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.button>
    </div>
  );
}

export function CarCard({ car, onSelect }) {
  const [imageOk, setImageOk] = useState(true);

  return (
    <div className="relative w-full max-w-[420px] rounded-[28px] overflow-hidden">
      {/* Outer glow — same colour as the accent, soft and offset */}
      <div
        className="absolute -inset-2 rounded-[32px] blur-2xl opacity-40 -z-10"
        style={{ background: car.accentColor }}
      />

      {/* Frame border (gradient ring around the card) */}
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{
          padding: 2,
          background: `linear-gradient(140deg, ${car.accentColor} 0%, rgba(255,255,255,0.08) 40%, ${car.accentColor}aa 100%)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Card body */}
      <div
        className="relative rounded-[28px] overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1a2030 0%, #0c0f18 60%, #07090f 100%)",
          boxShadow:
            "0 30px 60px -15px rgba(0,0,0,0.6), 0 10px 20px -5px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header: type badge + flag */}
        <div className="flex items-center justify-between px-5 pt-4 pb-1">
          <span
            className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded"
            style={{ background: car.accentColor, color: "#0a0d14" }}
          >
            {car.type}
          </span>
          <span className="text-2xl leading-none" aria-label="origin">
            {car.origin}
          </span>
        </div>

        {/* Title block */}
        <div className="px-5 pt-2">
          <h2 className="text-[34px] font-black text-white leading-[1] tracking-tight">
            {car.name}
          </h2>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45 mt-1.5">
            {car.variant}
          </p>
        </div>

        {/* Hero photo with radial halo — wrapped in motion.div for the
            shared-element morph into the detail view. layoutId is keyed by
            car.id so it matches the detail view's photo element. */}
        <motion.div
          layoutId={`photo-${car.id}`}
          className="relative h-40 mx-4 mt-3 mb-1 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{
            background: `radial-gradient(ellipse at center, ${car.accentColor}33 0%, transparent 65%)`,
          }}
        >
          {imageOk ? (
            <img
              src={car.image}
              alt={car.name}
              className="max-h-full max-w-full object-contain"
              // Game-y normalisation filter applied to every car photo.
              // Punches contrast and saturation so a deck of mixed-source
              // press shots reads as cohesive, then drops a soft shadow
              // for the floating-on-card effect.
              style={{
                filter:
                  "contrast(1.1) saturate(1.3) drop-shadow(0 8px 14px rgba(0,0,0,0.5))",
              }}
              onError={() => setImageOk(false)}
            />
          ) : (
            <div className="text-center text-white/35 text-[11px] px-6 leading-relaxed">
              Drop a transparent PNG at
              <br />
              <code className="text-white/55">{car.image}</code>
            </div>
          )}
        </motion.div>

        {/* Hexagon — wrapped in motion.div for shared-element morph. */}
        <motion.div layoutId={`hex-${car.id}`} className="px-2 pt-1 pb-2">
          <StatHexagon car={car} />
        </motion.div>

        {/* Dedicated tap-to-open button. */}
        <TapCue
          accentColor={car.accentColor}
          onSelect={() => onSelect?.(car.id)}
        />
      </div>
    </div>
  );
}

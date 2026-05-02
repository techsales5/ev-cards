// CarCard.jsx
// ---------------------------------------------------------------------------
// The atomic unit of the whole app. Top Trumps / Pokemon vibe:
//   - Dark base with accent-coloured frame and outer glow
//   - Type badge + country flag at the top
//   - Big bold name, smaller variant subtitle
//   - Hero photo over a soft accent-coloured radial halo
//   - Hexagon (the hook)
//   - Spec readout list (the truth)
//
// The card has a fixed width — when you build the deck in Phase 3 you'll
// stack these in a relative-positioned container and let Framer Motion
// animate transforms.
// ---------------------------------------------------------------------------

import { useState } from "react";
import { motion } from "framer-motion";
import { STAT_CONFIG } from "../data/statConfig";
import { StatHexagon } from "./StatHexagon";
import { StatRow } from "./StatRow";

// Small labelled divider between the hexagon and the stat readout.
// The bobbing chevron tells the user the rows below are scrollable / there's
// more content under the hex (the radar is the hook, the readout is the truth).
function SpecsDivider() {
  return (
    <div className="flex items-center gap-3 px-5 -mt-1 mb-2 text-white/40">
      <div className="flex-1 h-px bg-white/10" />
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-[0.25em]">
          Specs
        </span>
        <motion.svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
          animate={{ y: [0, 2, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </div>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

export function CarCard({ car }) {
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
          <span className="text-2xl leading-none" aria-label="origine">
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

        {/* Hero photo with radial halo */}
        <div
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
        </div>

        {/* Hexagon */}
        <div className="px-2 pt-1 pb-2">
          <StatHexagon stats={car.stats} accentColor={car.accentColor} />
        </div>

        {/* Divider — labels the readout below and signals "scroll for more" */}
        <SpecsDivider />

        {/* Stat readout */}
        <div className="px-5 pb-5">
          {STAT_CONFIG.map((stat) => (
            <StatRow
              key={stat.key}
              stat={stat}
              value={car.stats[stat.key]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

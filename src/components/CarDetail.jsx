// CarDetail.jsx
// ---------------------------------------------------------------------------
// Phase 4 — full-screen detail view.
//
// Layout B (hex-anchored editorial):
//   Above the fold: photo → name + badge → verdict one-liner → hexagon
//   Below the fold:  verdict paragraph → real-world performance
//                    (range gap + charge curve) → stat readout → safety → extras
//
// Photo and hexagon carry layoutIds matching the card, so opening and closing
// the detail view shared-element-morphs them between the two screens. Other
// content fades via the parent motion.div's opacity transition.
//
// Dismissal at v0: X button top-right. Drag-down-to-dismiss is a follow-up
// because it conflicts with vertical scroll on a content-rich view.
// ---------------------------------------------------------------------------

import { motion } from "framer-motion";
import { STAT_CONFIG } from "../data/statConfig";
import { StatHexagon } from "./StatHexagon";
import { StatRow } from "./StatRow";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CloseButton({ onClose }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/15 text-white/80 backdrop-blur transition-colors"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M1 1l10 10M11 1L1 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

// Side-by-side numerals: Highway (real) / WLTP / Gap. Gap is emphasised in
// the car's accent colour to land the data-honesty story.
function RangeGap({ car }) {
  const real = car.realHighwayRange;
  const wltp = car.stats.range.hex;
  const gapPct = Math.round((1 - real / wltp) * 100);

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-[0.15em] text-white/45 mb-1">
          Highway
        </div>
        <div className="text-2xl font-black text-white tabular-nums leading-none">
          {real}
        </div>
        <div className="text-[11px] text-white/55 mt-1">km</div>
      </div>
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-[0.15em] text-white/45 mb-1">
          WLTP
        </div>
        <div className="text-2xl font-black text-white/50 tabular-nums leading-none">
          {wltp}
        </div>
        <div className="text-[11px] text-white/40 mt-1">km</div>
      </div>
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-[0.15em] text-white/45 mb-1">
          Gap
        </div>
        <div
          className="text-2xl font-black tabular-nums leading-none"
          style={{ color: car.accentColor }}
        >
          {gapPct}%
        </div>
        <div className="text-[11px] text-white/55 mt-1">missing</div>
      </div>
    </div>
  );
}

// Compact SVG line chart: kW vs state-of-charge, 10–80% band tinted in the
// accent colour. Below the chart: the 10–80% time as the editorial takeaway,
// peak kW alongside as a contrast number.
function ChargeCurve({ car }) {
  const points = car.chargeCurve;
  if (!points || points.length < 2) {
    return (
      <div className="text-[12px] text-white/40 py-4">
        No charge curve data yet.
      </div>
    );
  }

  const width = 320;
  const height = 130;
  const pad = { left: 26, right: 10, top: 10, bottom: 22 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const peakKw = Math.max(...points.map((p) => p.kw));
  // Round up to next 50 for a clean y-axis.
  const yMax = Math.ceil(peakKw / 50) * 50;

  const xOf = (soc) => pad.left + (soc / 100) * innerW;
  const yOf = (kw) => pad.top + innerH - (kw / yMax) * innerH;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xOf(p.soc).toFixed(2)},${yOf(p.kw).toFixed(2)}`)
    .join(" ");

  // Closed area fill: the line, then down to the baseline, then back.
  const baseY = pad.top + innerH;
  const areaPath =
    `${linePath} ` +
    `L${xOf(points[points.length - 1].soc).toFixed(2)},${baseY} ` +
    `L${xOf(points[0].soc).toFixed(2)},${baseY} Z`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto select-none"
        aria-label="Charge curve from 10 to 80 percent state of charge"
      >
        {/* 10–80% band — the part of the curve you actually use on a road trip */}
        <rect
          x={xOf(10)}
          y={pad.top}
          width={xOf(80) - xOf(10)}
          height={innerH}
          fill={car.accentColor}
          fillOpacity={0.08}
        />
        {/* Horizontal grid lines at 0 / 50% / 100% of yMax */}
        {[0, 0.5, 1].map((p) => (
          <line
            key={p}
            x1={pad.left}
            y1={pad.top + innerH * p}
            x2={width - pad.right}
            y2={pad.top + innerH * p}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}
        {/* Curve area fill */}
        <path d={areaPath} fill={car.accentColor} fillOpacity={0.15} />
        {/* Curve line */}
        <path
          d={linePath}
          fill="none"
          stroke={car.accentColor}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Axis labels */}
        <text x={2} y={pad.top + 6} fontSize="9" fill="rgba(255,255,255,0.45)">
          {yMax}
        </text>
        <text
          x={2}
          y={pad.top + innerH - 2}
          fontSize="9"
          fill="rgba(255,255,255,0.45)"
        >
          0
        </text>
        <text
          x={pad.left}
          y={height - 6}
          fontSize="9"
          fill="rgba(255,255,255,0.45)"
        >
          0%
        </text>
        <text
          x={xOf(50) - 8}
          y={height - 6}
          fontSize="9"
          fill="rgba(255,255,255,0.45)"
        >
          50%
        </text>
        <text
          x={xOf(100) - 16}
          y={height - 6}
          fontSize="9"
          fill="rgba(255,255,255,0.45)"
        >
          100%
        </text>
      </svg>
      <div className="flex items-baseline justify-between mt-2 text-[12px]">
        <div className="text-white/55">
          <span className="text-white font-bold tabular-nums">
            {car.chargeTime10to80}
          </span>{" "}
          min for 10–80%
        </div>
        <div className="text-white/40">
          Peak{" "}
          <span className="text-white/75 tabular-nums">{peakKw}</span> kW
        </div>
      </div>
    </div>
  );
}

// Euro NCAP star rating + year of test, as a single muted line. Credibility
// marker only — anyone who wants the sub-score breakdown clicks out.
function NcapRow({ ncap }) {
  if (!ncap) return null;
  const filled = "★".repeat(ncap.stars);
  const empty = "☆".repeat(Math.max(0, 5 - ncap.stars));
  return (
    <div className="flex items-baseline justify-between border-b border-white/10 py-2">
      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/55">
        Euro NCAP
      </span>
      <span className="text-sm">
        <span className="text-yellow-400">{filled}</span>
        <span className="text-white/20">{empty}</span>
        <span className="ml-2 text-white/45 text-[11px] tabular-nums">
          {ncap.year}
        </span>
      </span>
    </div>
  );
}

// Two-column compact label-value grid. Six fields max per design.
function ExtrasGrid({ extras }) {
  if (!extras) return null;
  const rows = [
    ["Drive", extras.drive],
    ["Weight", `${extras.weightKg.toLocaleString("en-US")} kg`],
    ["Length", `${(extras.lengthMm / 1000).toFixed(2)} m`],
    ["Width", `${(extras.widthMm / 1000).toFixed(2)} m`],
    [
      "Warranty",
      `${extras.warrantyYears} yr / ${Math.round(extras.warrantyKm / 1000)}k km`,
    ],
    ["Year", String(extras.year)],
  ];
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex items-baseline justify-between border-b border-white/10 py-1.5"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/55">
            {label}
          </span>
          <span className="font-mono text-[12px] font-bold text-white tabular-nums">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

export function CarDetail({ car, onClose }) {
  if (!car) return null;

  // Stat readout filters out `range` — that axis gets its own dedicated
  // Range Gap treatment in the Real-world performance section above.
  const readoutStats = STAT_CONFIG.filter((s) => s.key !== "range");

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.25, delay: 0.05 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      style={{
        background:
          "radial-gradient(ellipse at top, #1a2030 0%, #050608 70%)",
      }}
    >
      <CloseButton onClose={onClose} />

      <div className="max-w-[480px] mx-auto px-5 pt-12 pb-12">
        {/* ============================================================ */}
        {/* Above the fold                                                */}
        {/* ============================================================ */}

        {/* Hero photo — shared-element morph from the card. */}
        <motion.div
          layoutId={`photo-${car.id}`}
          className="relative h-52 rounded-2xl overflow-hidden flex items-center justify-center mb-4"
          style={{
            background: `radial-gradient(ellipse at center, ${car.accentColor}33 0%, transparent 65%)`,
          }}
        >
          <img
            src={car.image}
            alt={car.name}
            className="max-h-full max-w-full object-contain"
            style={{
              filter:
                "contrast(1.1) saturate(1.3) drop-shadow(0 8px 14px rgba(0,0,0,0.5))",
            }}
          />
        </motion.div>

        {/* Type badge + origin flag */}
        <div className="flex items-center justify-between mb-2">
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

        {/* Name + variant */}
        <h2 className="text-[32px] font-black text-white leading-[1] tracking-tight">
          {car.name}
        </h2>
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/45 mt-1.5 mb-5">
          {car.variant}
        </p>

        {/* Verdict one-liner — the editorial calling card */}
        {car.verdict?.headline && (
          <p className="text-[17px] leading-snug text-white/85 mb-6">
            {car.verdict.headline}
          </p>
        )}

        {/* Hexagon — shared-element morph from the card. Smaller here than
            on the card; the photo and verdict eat the above-the-fold space. */}
        <motion.div
          layoutId={`hex-${car.id}`}
          className="mx-auto mb-10"
          style={{ maxWidth: 240 }}
        >
          <StatHexagon car={car} />
        </motion.div>

        {/* ============================================================ */}
        {/* Below the fold                                                */}
        {/* ============================================================ */}

        {/* Verdict paragraph — collapses gracefully when body is empty */}
        {car.verdict?.body && (
          <p className="text-[14px] leading-relaxed text-white/70 mb-8">
            {car.verdict.body}
          </p>
        )}

        {/* Real-world performance — the thesis made visible */}
        <section className="mb-10">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45 mb-4">
            Real-world performance
          </h3>
          <RangeGap car={car} />
          <ChargeCurve car={car} />
        </section>

        {/* Spec readout — range axis skipped (lives in Range Gap above) */}
        <section className="mb-10">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45 mb-3">
            Specifications
          </h3>
          {readoutStats.map((stat) => (
            <StatRow
              key={stat.key}
              stat={stat}
              value={car.stats[stat.key]}
            />
          ))}
        </section>

        {/* Safety */}
        <section className="mb-10">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45 mb-3">
            Safety
          </h3>
          <NcapRow ncap={car.ncap} />
        </section>

        {/* Extras */}
        <section className="mb-10">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45 mb-3">
            Extras
          </h3>
          <ExtrasGrid extras={car.extras} />
        </section>
      </div>
    </motion.div>
  );
}

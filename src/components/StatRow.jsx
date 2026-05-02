// StatRow.jsx
// ---------------------------------------------------------------------------
// One row in the stat readout below the hexagon. Mono-numeric for that
// "spec sheet" feel — Pokemon-card-style numbers right-aligned against
// uppercase labels on the left.
//
// When a stat has a trim envelope (min/max), the row shows the headline
// value followed by a muted parenthetical with the envelope:
//   AUTONOMIE                 410 km (312–410)
// Stats with no envelope collapse to a single number with no parenthetical:
//   COFFRE                              326 L
// ---------------------------------------------------------------------------

import { formatHex, formatRange } from "../data/statConfig";

export function StatRow({ stat, value }) {
  const hex = formatHex(stat, value);
  const range = formatRange(stat, value);

  return (
    <div className="flex items-baseline justify-between border-b border-white/10 py-1.5 gap-2">
      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/55 shrink-0">
        {stat.label}
      </span>
      <span className="text-right truncate">
        <span className="font-mono text-sm font-bold text-white tabular-nums">
          {hex}
        </span>
        {range && (
          <span className="font-mono text-[11px] font-medium text-white/40 tabular-nums ml-1.5">
            {range}
          </span>
        )}
      </span>
    </div>
  );
}

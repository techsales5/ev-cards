// statConfig.js
// ---------------------------------------------------------------------------
// The six axes shown on every CarCard's hexagon.
//
// `direction`:
//   "high" = bigger raw value is a better score (range, charge speed, boot)
//   "low"  = smaller raw value is a better score (price, 0-100, efficiency).
//            These are inverted at render time so the hexagon always reads
//            "bigger shape = better car".
//
// `min` / `max`:
//   Bounds used to normalise raw values into 0..1 for the radar. Calibrate
//   these in Phase 6 once you have the full 10-15 car dataset. For now they
//   are reasonable bounds across mainstream EVs sold in France in 2025-26.
//
// `shortLabel`: used inside the cramped hexagon. `label` is used in the
// stat readout list below the radar.
//
// Stat-value shape (variant envelopes)
// ---------------------------------------------------------------------------
// Each car's stat is an object: { hex, min?, max? }
//   - `hex` is the value plotted on the radar (the "headline" trim — usually
//     the most-sold or launch trim). This is what the hexagon shows.
//   - `min` / `max` describe the envelope across all trims/options of the
//     same model. If a stat doesn't vary across trims (e.g. boot space),
//     omit them — the row will just show the single hex value.
// ---------------------------------------------------------------------------

export const STAT_CONFIG = [
  {
    key: "range",
    label: "Autonomie",
    shortLabel: "AUTO",
    unit: "km",
    direction: "high",
    min: 200,
    max: 650,
  },
  {
    key: "charge",
    label: "Charge DC",
    shortLabel: "CHARGE",
    unit: "kW",
    direction: "high",
    min: 50,
    max: 350,
  },
  {
    key: "price",
    label: "Prix",
    shortLabel: "PRIX",
    unit: "€",
    direction: "low",
    min: 25000,
    max: 100000,
    format: "price",
  },
  {
    key: "accel",
    label: "0-100",
    shortLabel: "0-100",
    unit: "s",
    direction: "low",
    min: 2.0,
    max: 12.0,
  },
  {
    key: "boot",
    label: "Coffre",
    shortLabel: "COFFRE",
    unit: "L",
    direction: "high",
    min: 200,
    max: 700,
  },
  {
    key: "efficiency",
    label: "Consommation",
    shortLabel: "CONSO",
    unit: "Wh/km",
    direction: "low",
    min: 100,
    max: 250,
  },
];

// Pull the numeric value used for the radar from a stat-value entry.
// Accepts either { hex, ... } or a plain number for back-compat.
export function getHexValue(statValue) {
  return typeof statValue === "object" ? statValue.hex : statValue;
}

// Normalise a raw value to a 0..1 score for the hexagon.
// Output is always "bigger = better" — `direction: "low"` stats are inverted.
export function normaliseStat(stat, value) {
  const { min, max, direction } = stat;
  const clamped = Math.max(min, Math.min(max, value));
  const linear = (clamped - min) / (max - min);
  return direction === "high" ? linear : 1 - linear;
}

// Format a single raw number for display, using French locale where applicable.
function formatNumber(stat, n) {
  if (stat.format === "price") {
    return n.toLocaleString("fr-FR");
  }
  // Numbers like 14.7 keep one decimal; integers don't.
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

// Format the headline value for the readout — e.g. "410 km", "32 500 €".
export function formatHex(stat, statValue) {
  const hex = getHexValue(statValue);
  return `${formatNumber(stat, hex)} ${stat.unit}`;
}

// Format the trim envelope for the readout — e.g. "(312–410)", "(80–100)".
// Returns null when there is nothing meaningful to show; the row then
// collapses to just the headline value with no parenthetical.
export function formatRange(stat, statValue) {
  if (typeof statValue !== "object") return null;
  const { min, max } = statValue;
  if (min === undefined || max === undefined) return null;
  if (min === max) return null;
  // En-dash (–) for ranges, not hyphen.
  return `(${formatNumber(stat, min)}–${formatNumber(stat, max)})`;
}

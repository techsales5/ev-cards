// StatHexagon.jsx
// ---------------------------------------------------------------------------
// Pure SVG radar/spider chart. Six axes, one polygon per car.
//
// How the math works:
//   Each axis i sits at angle θ = (2π · i / 6) − π/2
//   (the −π/2 puts axis 0 at the top — "12 o'clock" — instead of due east).
//
//   For each axis, the car's vertex is plotted at:
//     x = cx + R · v · cos(θ)
//     y = cy + R · v · sin(θ)
//   where v is the stat's normalised 0..1 value and R is the outer radius.
//
//   We also draw concentric reference hexagons at 25/50/75/100% to give the
//   eye a scale, plus thin spokes from centre to each vertex.
// ---------------------------------------------------------------------------

import { STAT_CONFIG, normaliseStat, getHexValue } from "../data/statConfig";

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.36;
const LABEL_RADIUS = SIZE * 0.46;

// Angle for axis i. Starts at 12 o'clock and goes clockwise.
function angle(i, n = STAT_CONFIG.length) {
  return (Math.PI * 2 * i) / n - Math.PI / 2;
}

function pointOnCircle(r, i) {
  return [CENTER + r * Math.cos(angle(i)), CENTER + r * Math.sin(angle(i))];
}

function toPolyString(points) {
  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

export function StatHexagon({ car }) {
  const accentColor = car.accentColor ?? "#FFD400";
  const carPoints = STAT_CONFIG.map((stat, i) => {
    // Range axis plots real-world highway range, not WLTP — WLTP surfaces
    // only in the detail view's Range Gap section. Other axes still pull
    // the headline `hex` value from stats[stat.key].
    const value =
      stat.key === "range"
        ? car.realHighwayRange
        : getHexValue(car.stats[stat.key]);
    const v = normaliseStat(stat, value);
    return pointOnCircle(RADIUS * v, i);
  });

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full h-auto select-none"
      aria-label="Stat hexagon"
    >
      {/* Concentric grid hexagons */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={toPolyString(STAT_CONFIG.map((_, i) => pointOnCircle(RADIUS * level, i)))}
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={1}
        />
      ))}

      {/* Spokes from centre to each axis tip */}
      {STAT_CONFIG.map((_, i) => {
        const [x, y] = pointOnCircle(RADIUS, i);
        return (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        );
      })}

      {/* Car polygon — the actual stat shape */}
      <polygon
        points={toPolyString(carPoints)}
        fill={accentColor}
        fillOpacity={0.32}
        stroke={accentColor}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Vertex dots */}
      {carPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill={accentColor} />
      ))}

      {/* Axis labels around the outside */}
      {STAT_CONFIG.map((stat, i) => {
        const [x, y] = pointOnCircle(LABEL_RADIUS, i);
        return (
          <text
            key={stat.key}
            x={x}
            y={y}
            fontSize={9}
            fontWeight={700}
            fill="rgba(255,255,255,0.7)"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ letterSpacing: "0.08em" }}
          >
            {stat.shortLabel}
          </text>
        );
      })}
    </svg>
  );
}

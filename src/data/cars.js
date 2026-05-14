// cars.js
// ---------------------------------------------------------------------------
// Six cars for Phase 3. The Renault 5 plus the five biggest BEV sellers in
// Europe in 2024–2025 — kept Euro-leaning, not France-specific.
//
// Fields:
//   id           — kebab-case unique key, also used in URLs eventually
//   name         — display name (big text on the card)
//   variant      — sub-line for the headline trim (the one the radar plots)
//   type         — a short category badge ("City car", "Sedan"…)
//   origin       — flag emoji for the manufacturer's country of origin
//   image        — path under /public, e.g. "/cars/renault-5.png"
//                  (drop a transparent PNG there; the card has a graceful
//                   fallback if the image isn't found)
//   accentColor  — used for the card frame, glow, and hexagon fill
//   popularity   — France 2024–2025 BEV ranking among these 6 cars (1 = top).
//                  Drives the default sort order; see sortCars() below.
//   stats        — see Stat-value shape in statConfig.js
//
// Each stat is { hex, min?, max? }:
//   - `hex` is the value the hexagon plots — pick the headline trim
//     (most-sold or launch trim) so the radar tells the model's "main story".
//   - `min` / `max` are the full envelope across all trims/battery
//     options, shown in parentheses next to the hex value to flag that
//     a single number doesn't tell the whole story.
//   - Omit min/max for stats that don't vary across trims (e.g. boot).
//
// Phase 4 additions:
//   verdict           — { headline, body }: editorial calling card per car.
//                       Headline is the one-liner above the fold in the
//                       detail view. Body is an optional paragraph below
//                       the fold; collapses gracefully when empty.
//   realHighwayRange  — km of real-world motorway range at ~110 km/h. NOT
//                       WLTP. The hexagon plots this; stats.range below stays
//                       as WLTP, used only in the detail view's Range Gap
//                       section as a counterpoint.
//   chargeTime10to80  — minutes for a 10–80% DC fast-charge in a real session.
//   chargeCurve       — array of { soc, kw } points, 7–10 samples across the
//                       curve. Powers the ChargeCurve chart in the detail view.
//   ncap              — { stars: 1–5, year: yyyy } from euroncap.com.
//   extras            — drive, weight, dimensions, warranty, release year.
//                       Surfaced in the detail view's Extras grid.
//
// Stat figures use widely-published WLTP/manufacturer numbers for `stats.*`.
// Real-world figures (realHighwayRange, chargeTime10to80, chargeCurve) are
// sourced from InsideEVs, Bjørn Nyland, Fastned Open Data, and EVKX — see
// per-car sourcing comments. Calibrating to a single authoritative source is
// a Phase 6 chore.
// ---------------------------------------------------------------------------

export const CARS = [
  {
    id: "renault-5-e-tech",
    name: "Renault 5",
    variant: "E-Tech Comfort Range 150",
    type: "City car",
    origin: "🇫🇷",
    image: "/cars/renault-5.png",
    accentColor: "#FFD400", // Pop Yellow — the iconic launch colour
    popularity: 1,           // #1 BEV in France in 2024–2025
    stats: {
      // 52 kWh / 150 hp is hex; 40 kWh urbaine is the lower bound.
      range:      { hex: 410,   min: 312,   max: 410   }, // km WLTP
      charge:     { hex: 100,   min: 80,    max: 100   }, // kW DC peak
      price:      { hex: 32500, min: 25000, max: 37000 }, // € (Évolution → top spec)
      accel:      { hex: 8.0,   min: 8.0,   max: 9.0   }, // s 0–100
      boot:       { hex: 326                            }, // L — same across trims
      efficiency: { hex: 147                            }, // Wh/km
    },
    verdict: {
      headline: "France's first lovable EV in twenty years, wearing a 1972 jacket.",
      body: "",
    },
    realHighwayRange: 265,  // km — InsideEVs UK + ArenaEV, midpoint of 240–290 spread
    chargeTime10to80: 32,   // min — EVKX/Fastned-derived, 100 kW peak DC
    chargeCurve: [
      { soc: 10, kw: 100 }, { soc: 20, kw: 95 }, { soc: 30, kw: 90 },
      { soc: 50, kw: 75 },  { soc: 60, kw: 65 }, { soc: 70, kw: 50 },
      { soc: 80, kw: 40 },
    ],
    ncap: { stars: 4, year: 2024 },  // chest protection rated marginal
    extras: {
      drive: "FWD",
      weightKg: 1535,
      lengthMm: 3922,
      widthMm: 1774,
      warrantyYears: 5,
      warrantyKm: 100000,
      year: 2024,
    },
  },
  {
    id: "tesla-model-y",
    name: "Tesla Model Y",
    variant: "Long Range RWD",
    type: "Crossover",
    origin: "🇺🇸",
    image: "/cars/tesla-model-y.png",
    accentColor: "#E82127",  // Tesla signature red
    popularity: 2,
    stats: {
      // Long Range RWD (75 kWh, 2024 Juniper refresh) is hex.
      // Standard Range (60 kWh) anchors the lower end.
      range:      { hex: 600,   min: 455,   max: 622   },
      charge:     { hex: 250,   min: 170,   max: 250   },
      price:      { hex: 49990, min: 44990, max: 59990 },
      accel:      { hex: 5.9,   min: 3.7,   max: 6.9   },
      boot:       { hex: 854                            }, // incl. frunk + underfloor
      efficiency: { hex: 155                            },
    },
    verdict: {
      headline: "The EV that became infrastructure, and asks awkward questions at dinner.",
      body: "",
    },
    realHighwayRange: 500,  // km — derived from Juniper LR AWD 70mph (480 km) + RWD efficiency bonus; awaiting direct LR RWD test
    chargeTime10to80: 27,   // min — V3 Supercharger, owner-reported
    chargeCurve: [
      { soc: 10, kw: 240 }, { soc: 20, kw: 210 }, { soc: 30, kw: 170 },
      { soc: 40, kw: 140 }, { soc: 50, kw: 115 }, { soc: 60, kw: 90 },
      { soc: 70, kw: 75 },  { soc: 80, kw: 60 },
    ],
    ncap: { stars: 5, year: 2022 },  // pre-Juniper test; structure unchanged, Tesla cites 5★
    extras: {
      drive: "RWD",
      weightKg: 1921,
      lengthMm: 4797,
      widthMm: 1982,
      warrantyYears: 4,
      warrantyKm: 80000,    // basic vehicle; battery: 8yr / 192,000 km
      year: 2025,           // Juniper refresh, global early 2025
    },
  },
  {
    id: "volvo-ex30",
    name: "Volvo EX30",
    variant: "Single Motor Extended Range",
    type: "Compact SUV",
    origin: "🇸🇪",
    image: "/cars/volvo-ex30.png",
    accentColor: "#6B8E7F",  // Volvo "Moss Yellow" / sage green
    popularity: 3,
    stats: {
      // Single Motor Extended Range (69 kWh) is hex.
      // Twin Motor Performance is the upper bound on charge/accel.
      range:      { hex: 480,   min: 344,   max: 480   },
      charge:     { hex: 153,   min: 134,   max: 153   },
      price:      { hex: 38000, min: 36000, max: 48000 },
      accel:      { hex: 5.3,   min: 3.6,   max: 5.7   },
      boot:       { hex: 318                            },
      efficiency: { hex: 163                            },
    },
    verdict: {
      headline: "Half a Volvo at half the price, and you can hear it.",
      body: "",
    },
    realHighwayRange: 395,  // km — Bjørn Nyland @ 90 km/h (414) + Recharged @ 70mph (398), triangulated
    chargeTime10to80: 28,   // min — ~150 kW DC peak
    chargeCurve: [
      { soc: 10, kw: 150 }, { soc: 20, kw: 145 }, { soc: 30, kw: 130 },
      { soc: 40, kw: 120 }, { soc: 50, kw: 100 }, { soc: 60, kw: 85 },
      { soc: 70, kw: 67 },  { soc: 80, kw: 45 },
    ],
    ncap: { stars: 5, year: 2024 },
    extras: {
      drive: "RWD",
      weightKg: 1830,
      lengthMm: 4233,
      widthMm: 1837,
      warrantyYears: 3,
      warrantyKm: 100000,
      year: 2024,
    },
  },
  {
    id: "tesla-model-3",
    name: "Tesla Model 3",
    variant: "Long Range RWD",
    type: "Sedan",
    origin: "🇺🇸",
    image: "/cars/tesla-model-3.png",
    accentColor: "#1E5BB8",  // Tesla Deep Blue Metallic
    popularity: 4,
    stats: {
      // Long Range RWD (post-2023 Highland refresh) is hex.
      // Standard Range anchors the lower end on range/accel.
      range:      { hex: 702,   min: 554,   max: 702   },
      charge:     { hex: 250,   min: 170,   max: 250   },
      price:      { hex: 44990, min: 42990, max: 56990 },
      accel:      { hex: 5.2,   min: 3.1,   max: 6.1   },
      boot:       { hex: 594                            }, // incl. frunk
      efficiency: { hex: 138                            },
    },
    verdict: {
      headline: "The first EV your dad heard of, somehow still the smartest sedan in the room.",
      body: "",
    },
    realHighwayRange: 533,  // km — InsideEVs/Out of Spec 70mph (331 mi), Highland LR RWD, 85% of EPA
    chargeTime10to80: 27,   // min — V3 Supercharger session
    chargeCurve: [
      { soc: 10, kw: 230 }, { soc: 20, kw: 210 }, { soc: 30, kw: 170 },
      { soc: 40, kw: 140 }, { soc: 50, kw: 110 }, { soc: 60, kw: 90 },
      { soc: 70, kw: 75 },  { soc: 80, kw: 60 },
    ],
    ncap: { stars: 5, year: 2024 },  // Highland re-tested under 2024 protocol
    extras: {
      drive: "RWD",
      weightKg: 1823,
      lengthMm: 4720,
      widthMm: 1849,
      warrantyYears: 4,
      warrantyKm: 80000,    // basic vehicle; battery: 8yr / 192,000 km
      year: 2023,           // Highland refresh, late 2023
    },
  },
  {
    id: "vw-id3",
    name: "Volkswagen ID.3",
    variant: "Pro S",
    type: "Hatchback",
    origin: "🇩🇪",
    image: "/cars/vw-id3.png",
    accentColor: "#00B4D8",  // ID-family electric cyan
    popularity: 5,
    stats: {
      // Pro S (77 kWh) is hex. Pure (52 kWh) anchors the lower end.
      range:      { hex: 559,   min: 388,   max: 559   },
      charge:     { hex: 170,   min: 120,   max: 170   },
      price:      { hex: 42990, min: 35990, max: 48990 },
      accel:      { hex: 7.4,   min: 7.4,   max: 9.6   },
      boot:       { hex: 385                            },
      efficiency: { hex: 152                            },
    },
    verdict: {
      headline: "The 'people's car' that finally remembered how to be one.",
      body: "",
    },
    realHighwayRange: 380,  // km — Bjørn Nyland 120 km/h test (325 km) interpolated to 110 km/h
    chargeTime10to80: 30,   // min — facelifted Pro S, 170+ kW peak DC
    chargeCurve: [
      { soc: 10, kw: 170 }, { soc: 20, kw: 165 }, { soc: 30, kw: 150 },
      { soc: 40, kw: 130 }, { soc: 50, kw: 110 }, { soc: 60, kw: 90 },
      { soc: 70, kw: 75 },  { soc: 80, kw: 55 },
    ],
    ncap: { stars: 5, year: 2020 },  // original 2020 test; re-affirmed under 2025 protocol
    extras: {
      drive: "RWD",
      weightKg: 1882,
      lengthMm: 4264,
      widthMm: 1809,
      warrantyYears: 3,
      warrantyKm: 100000,   // battery: 8yr / 160,000 km separately
      year: 2023,           // facelift launched 2023, Pro S MY24 update mid-2023/2024
    },
  },
  {
    id: "skoda-enyaq",
    name: "Škoda Enyaq",
    variant: "85 RWD",
    type: "Family SUV",
    origin: "🇨🇿",
    image: "/cars/skoda-enyaq.png",
    accentColor: "#4BA82E",  // Škoda corporate green
    popularity: 6,
    stats: {
      // 85 RWD (82 kWh usable, post-2024 facelift) is hex.
      // 50 entry trim anchors range/accel lower bounds; 85x Sportline accel.
      range:      { hex: 581,   min: 422,   max: 581   },
      charge:     { hex: 175,   min: 125,   max: 175   },
      price:      { hex: 48990, min: 39990, max: 58990 },
      accel:      { hex: 6.7,   min: 5.5,   max: 9.0   },
      boot:       { hex: 585                            },
      efficiency: { hex: 159                            },
    },
    verdict: {
      headline: "Same parts as the Volkswagen, sharper everywhere it matters.",
      body: "",
    },
    realHighwayRange: 380,  // km — EVKX 110 km/h model; awaiting direct InsideEVs/Nyland test of post-APP550 spec
    chargeTime10to80: 28,   // min — Škoda official; consistent with 135 kW peak curve
    chargeCurve: [
      { soc: 10, kw: 135 }, { soc: 20, kw: 135 }, { soc: 30, kw: 135 },
      { soc: 40, kw: 130 }, { soc: 50, kw: 110 }, { soc: 60, kw: 85 },
      { soc: 70, kw: 65 },  { soc: 80, kw: 50 },
    ],
    ncap: { stars: 5, year: 2021 },  // original test; re-affirmed 2025
    extras: {
      drive: "RWD",
      weightKg: 2141,
      lengthMm: 4658,
      widthMm: 1879,
      warrantyYears: 3,
      warrantyKm: 100000,
      year: 2024,           // 2024 powertrain refresh (APP550, faster charging)
    },
  },
];

// Default order shown in the deck. Lower `popularity` = appears earlier.
// Phase 3 decision: sort by France BEV popularity. Anything but a single
// stat (which would feel like a leaderboard); popularity is opinionated
// without being arbitrary.
export function sortCars(cars) {
  return [...cars].sort((a, b) => a.popularity - b.popularity);
}

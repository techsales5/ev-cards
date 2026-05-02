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
// Stat figures use widely-published WLTP / manufacturer numbers as of
// early 2026. They're approximate enough for v1 — calibrating to a single
// authoritative source (ev-database.org) is a Phase 6 chore.
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
  },
];

// Default order shown in the deck. Lower `popularity` = appears earlier.
// Phase 3 decision: sort by France BEV popularity. Anything but a single
// stat (which would feel like a leaderboard); popularity is opinionated
// without being arbitrary.
export function sortCars(cars) {
  return [...cars].sort((a, b) => a.popularity - b.popularity);
}

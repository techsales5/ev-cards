// cars.js
// ---------------------------------------------------------------------------
// One car for now (Phase 2). The schema here is what every future car will
// follow when you expand to the full deck in Phase 3.
//
// Fields:
//   id           — kebab-case unique key, also used in URLs eventually
//   name         — display name (big text on the card)
//   variant      — sub-line for the headline trim (the one the radar plots)
//   type         — a short category badge ("Citadine", "SUV", "Berline"...)
//   origin       — flag emoji for the manufacturer's country of origin
//   image        — path under /public, e.g. "/cars/renault-5.png"
//                  (drop a transparent PNG there; the card has a graceful
//                   fallback if the image isn't found)
//   accentColor  — used for the card frame, glow, and hexagon fill
//   stats        — see Stat-value shape in statConfig.js
//
// Each stat is { hex, min?, max? }:
//   - `hex` is the value the hexagon plots — pick the headline trim
//     (most-sold or launch trim) so the radar tells the model's "main story".
//   - `min` / `max` are the full envelope across all trims/battery
//     options, shown in parentheses next to the hex value to flag that
//     a single number doesn't tell the whole story.
//   - Omit min/max for stats that don't vary across trims (e.g. boot).
// ---------------------------------------------------------------------------

export const CARS = [
  {
    id: "renault-5-e-tech",
    name: "Renault 5",
    variant: "E-Tech Comfort Range 150", // <-- the trim the hex values describe
    type: "City car",
    origin: "🇫🇷",
    image: "/cars/renault-5.png",
    accentColor: "#FFD400", // Pop Yellow — the iconic launch colour
    stats: {
      // 52 kWh / 150 hp is hex; 40 kWh urbaine is the lower bound.
      range:      { hex: 410,   min: 312,   max: 410   }, // km WLTP
      charge:     { hex: 100,   min: 80,    max: 100   }, // kW DC peak
      price:      { hex: 32500, min: 25000, max: 37000 }, // € (Évolution → top spec)
      accel:      { hex: 8.0,   min: 8.0,   max: 9.0   }, // s 0-100
      boot:       { hex: 326                            }, // L — same across trims
      efficiency: { hex: 147                            }, // Wh/km — varies <2 Wh/km, not worth showing
    },
  },
];

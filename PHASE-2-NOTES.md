# Phase 2 — One car, beautifully (v1 shipped)

What landed in this phase, and what's deliberately deferred.

## What's in v1

```
src/
├── App.jsx                    # responsive page wrapper
├── data/
│   ├── statConfig.js          # the 6 hexagon axes + normalisation
│   └── cars.js                # one Renault 5, with trim envelopes
└── components/
    ├── CarCard.jsx            # the framed card composition
    ├── StatHexagon.jsx        # the SVG radar
    └── StatRow.jsx            # one row in the spec readout

public/
└── cars/
    └── renault-5.svg          # placeholder silhouette
```

## Key decisions captured here so future-you doesn't relitigate them

**Six axes, not five or seven.** Range, charge speed, price, 0–100, boot, efficiency. Covers six distinct buyer personas with no redundancy. Calibrating min/max bounds lives in `statConfig.js` and is a Phase 6 chore.

**Hexagon plots one trim, readout shows the envelope.** Each stat is `{ hex, min, max }`. The radar uses `hex` (the headline trim — for the R5, "E-Tech Comfort Range 150"). Each row in the readout shows the headline value with the full lineup envelope in muted parens, so a 100 kW charge speed reads honestly as "100 kW (80–100)" — i.e., entry trims charge slower. Stats that don't vary across trims (boot, efficiency) omit min/max and just show the single number.

**Direction handling.** Stats marked `direction: "low"` (price, 0–100, efficiency) get inverted at normalisation time so the hexagon convention "bigger shape = better car" holds for every axis. Critical for Phase 5 when two hexagons overlap.

**Card sizing.** `w-full max-w-[420px]` on the card + `px-3 py-6 sm:p-6` on the page wrapper. Fills the screen on phones, caps on tablet/desktop.

**Image strategy.** The `<img>` element has a CSS filter (`contrast(1.1) saturate(1.3)` + drop-shadow) so any raw photo gets normalised to a more game-like, visually cohesive style. Sourcing strategy: ev-database.org for standardised side-profile shots; manufacturer press kits for hero cars. Side profile is the deck convention — every future car must match the angle of the R5.

**Internationalisation.** App is English-only, single locale. Currency is € across the deck (pan-European default). Numbers format with comma-grouped thousands (en-US locale) for international legibility. No i18n machinery — if multilingual support comes later it'll be a deliberate add, not a retrofit. The brand is **Kilovolt** at `kilovolt.app` — note that the domain is internationally pronounceable, which was part of the selection rationale.

## What's intentionally NOT in v1

| Feature | Phase |
|---|---|
| Multiple cars / swipe deck | 3 |
| Tap to expand detail view | 4 |
| Two-card overlap (VS mode) | 5 |
| Real photos for all 15 cars | 6 |
| Calibrated min/max bounds | 6 |

Resist temptation to start on these now. The Phase 2 atomic unit is one polished card — multiplying it is Phase 3, and you want the unit right before multiplying.

## Adding a real photo for the R5

When you have a transparent-background PNG:

1. Drop it at `public/cars/renault-5.png`
2. Change one line in `src/data/cars.js`: `image: "/cars/renault-5.png"`

The CSS filter on the `<img>` element handles stylisation automatically. Aim for ~800×500, car centred, side profile.

## Onboarding the next car (Phase 3 prep)

Add a new entry to the `CARS` array in `cars.js`. Required fields: `id`, `name`, `variant` (the headline trim), `type`, `origin`, `image`, `accentColor`, and `stats` with `{ hex, min, max }` per axis. Pick the hero trim deliberately — it's what the radar will plot.

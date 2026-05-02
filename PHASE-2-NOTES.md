# Phase 2 — One car, beautifully

Drop-in files for the Phase 1 React + Vite + Tailwind project.

## What's in here

```
src/
├── App.jsx                    # replace your Phase 1 App.jsx
├── data/
│   ├── statConfig.js          # the 6 hexagon axes + normalisation helpers
│   └── cars.js                # one Renault 5, ready to grow in Phase 3
└── components/
    ├── CarCard.jsx            # the framed Top Trumps card
    ├── StatHexagon.jsx        # the SVG radar
    └── StatRow.jsx            # one row in the stat readout
```

## Install

From the root of your Phase 1 project:

```bash
# Copy the files in (mirroring the directory layout above)
cp -r phase-2/src/* ./src/

# No new dependencies — everything is React + Tailwind defaults.
npm run dev
```

You should see the Renault 5 card centred on a dark background. The frame
is yellow because that's the Renault 5 launch colour ("Pop Yellow"). To
change the accent: edit `accentColor` in `data/cars.js`.

## Adding the photo

The card has a graceful fallback when the image isn't found — you'll see
"Drop a transparent PNG at /cars/renault-5.png" inside the photo area.
When you have one:

1. Create `public/cars/` in your project
2. Drop `renault-5.png` in there (transparent background, around 800×500)
3. Refresh

For sourcing transparent-background photos: manufacturer press kits are
the highest quality; failing that, removing the background from a press
photo with `remove.bg` works well. Save Phase 6 polish (real photos for
all 15 cars) for last — placeholder is fine while you iterate the design.

## How the hexagon math works

Each of the six axes sits at angle `θ = (2π · i / 6) − π/2`, so axis 0 is
at the top ("12 o'clock") and they go clockwise. For each stat, the
vertex sits at distance `R · v` from the centre, where:

- `R` is the outer radius
- `v` is the stat's normalised 0..1 value (see `normaliseStat` in
  `statConfig.js`)

Stats with `direction: "low"` (price, 0–100, efficiency) are inverted at
normalisation time, so the hexagon always reads "bigger shape = better
car". This is the convention you'll lean on heavily in Phase 5 when you
overlap two hexagons.

## Tweaking the design

- **Card width**: `w-[340px]` in `CarCard.jsx`
- **Accent colour**: `accentColor` per car in `cars.js`
- **Hexagon size**: `SIZE` constant at the top of `StatHexagon.jsx`
- **Grid level rings**: `gridLevels` array (currently 25/50/75/100%)
- **Type badge / origin flag**: the card header in `CarCard.jsx`

## What's intentionally NOT here yet

- Multiple cards / swipe deck → Phase 3
- Tap-to-expand detail view → Phase 4
- Two-card overlap (VS mode) → Phase 5

Resist adding any of these now. The Phase 2 brief is one card, polished —
because the card is the atomic unit and you want it right before
multiplying it.

## Phase 6 calibration note

The `min` / `max` bounds in `statConfig.js` are reasonable defaults for
mainstream EVs sold in France. Once you have the full 10-15 car dataset,
revisit them — the goal is that no car ever has all-zero or all-max
hexagons, and that the shape genuinely tells you what kind of car it is
at a glance.

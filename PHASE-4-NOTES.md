# Phase 4 — Detail view (design locked)

The atomic card from Phase 2 and the deck from Phase 3, plus the long-awaited "tap for receipts" payoff. The hexagon stops being the only truth and becomes the hook into a full editorial + data view per car.

## Repositioning to flag up front

Phase 4 is the moment Kilovolt stops being a "French-market" product and becomes a European-mainstream-and-broader BEV explorer with English UI throughout. The thesis (real-world data over marketing claims, curated editorial catalogue, per-axis-only no-composite-score) is unchanged; the audience widened, and one feature was dropped as a side effect.

What this changes practically:

- All UI copy in English. Existing `STAT_CONFIG.label` and `shortLabel` values already English — no retrofit needed.
- Bonus Écologique simulator link from the original brief is OUT.
- Currency stays € (catalogue is European mainstream, all MSRPs already in €).
- Distance stays km.
- Range methodology shifts to real-world highway, which transcends both WLTP (EU) and EPA (US) testing regimes — a feature of the broader positioning.

## Scope

```
src/
├── App.jsx                       # adds selectedCarId state, mounts CarDetail
├── components/
│   ├── CarCard.jsx               # slimmed (removes StatRow list), adds layoutIds
│   ├── CarDeck.jsx               # wires onTap → onSelect on top card
│   ├── CarDetail.jsx             # NEW — full-screen detail view
│   ├── StatHexagon.jsx           # accepts layoutId prop
│   ├── StatRow.jsx               # unchanged, reused in detail
│   ├── RangeGap.jsx              # NEW — side-by-side WLTP vs real-world
│   ├── ChargeCurve.jsx           # NEW — kW vs SoC compact chart
│   ├── NcapBadge.jsx             # NEW — star rating + year
│   └── ExtrasGrid.jsx            # NEW — two-column label-value grid
└── data/
    ├── cars.js                   # adds verdict, realHighwayRange, chargeTime10to80, chargeCurve, ncap, extras
    └── statConfig.js             # range.min/max recalibrated for real-world bounds
```

## Decisions

**Card slims down. Detail view is the truth, card is the hook.** The current card carries hexagon + full stat readout. Phase 4 strips the readout (`SpecsDivider` + `StatRow.map`) off the card. Card retains photo, name+badge, hexagon, and a new tap cue below the hex. Total card height drops from ~700px to ~400px. The card now reads as a *character select tile*, not a stat sheet.

**Tap cue is a chunky accent-coloured pill button.** "See details" + bobbing right-chevron, styled to match the type badge at the top of the card. First-pass design was a bare chevron + accent underline with the whole card surface as the tap target — empirical testing revealed that putting `onTap` on the same `motion.div` as `drag="x"` caused both handlers to fire on a successful swipe (deck advanced AND detail opened, on the *previous* card). Separating gesture concerns — drag stays on the parent in CarDeck, tap moves to a dedicated `motion.button` inside CarCard — sidesteps the Framer Motion conflict. The button is also more discoverable for first-contact users than a bare chevron.

**Detail view: full-screen takeover, not modal or bottom-sheet.** The detail is a destination, not a sidebar. Bottom-sheet fights with content density; modal feels too app-y for the game framing. Full-screen lets photo and hexagon breathe, and unlocks the strongest card-to-detail animation.

**Layout: hex-anchored editorial.** Above the fold: photo (~200px hero band) → name + badge + flag → verdict one-liner (prominent) → hexagon (~220px). Below the fold in order: verdict paragraph → Real-world performance block (charge curve + range gap) → full stat readout (the per-axis rows from the old card) → NCAP → Extras. The editorial calling card lands on arrival; data follows the claim.

**Animation: full shared-element morph.** Photo container (outer div with halo, not the `<img>`) and hexagon wrapper both carry `layoutId`. Spring physics: stiffness 260, damping 24 (slightly bouncier than the deck's swipe at damping 30). ~400ms morph. Detail background fades in over ~250ms starting at ~50ms after morph begins, so the morphing elements lead the eye. Card's name/badge/chevron fade to opacity 0 over ~200ms. Reverse on dismiss.

**Where AnimatePresence lives.** `CarDeck` keeps its own `AnimatePresence` with `mode="popLayout"` for top-card exit. `CarDetail` is mounted at App level, sibling to `CarDeck`, inside its own `AnimatePresence`. Two separate boundaries, no nesting. `layoutId` works across them.

**Dismissal: X button + drag-down.** X top-right of the detail view, white at ~60% opacity. `drag="y"` on the detail container, dismiss past ~80px offset or velocity threshold. Both trigger the same reverse-morph animation. Build both — X is the safety net, drag is the delight.

**Real-world performance block.** Two sub-blocks under one section header.

- *Range gap.* Side-by-side numerals: "Highway 320 km / WLTP 410 km / 22% gap." Gap percentage visually emphasised (larger weight or accent colour). No chart for one car; charting belongs to a cross-deck honesty view later, not v0.
- *Charge curve.* Compact ~120–140px chart, kW vs. battery SoC, 10–80% band shaded in accent colour. Takeaway sentence below ("10–80% in 28 min"). Peak kW noted alongside as contrast ("Peak 250 kW / Sustained ~140 kW on a real session"). This block is the thesis made visible — invest in it.

**Hexagon plots real-world range, not WLTP.** Current `STAT_CONFIG.range` bounds (min 200, max 650) are WLTP-era. The brief says real-world wherever there's a choice. Migrate `range.hex` in `cars.js` to real-world highway, recalibrate `STAT_CONFIG.range.min/max` to roughly 150/500. The card's hexagon shape changes for every car as a side effect. WLTP only appears in the Range Gap section as a counterpoint, never on the hexagon.

**No visible 0–100 score per axis.** The brief's "absolute reference points anchored 0–100" idea lives inside `STAT_CONFIG.min/max`. The hexagon shape *is* the visualization. Adding a 0–100 numeral on each stat row duplicates that and manufactures a metric users could fixate on. The whole point of the hexagon framing is to dodge that.

**Brand survives the repositioning.** Kilovolt is a unit name, language-neutral, lowercase wordmark at kilovolt.app. No change.

## Still open at the time of writing

- *NCAP layout.* Push: just star rating + year tested as a single muted line, no sub-score breakdown. Credibility marker, not deep-dive.
- *Extras grid contents.* Candidate fields: drive type (RWD/AWD), weight (kg), length × width (mm), warranty (years/km), year of release. Two-column compact label-value grid.
- *Verdict tone.* Direction is informed-enthusiast and dry-witty. Reference voice not finalised — The Verge's car coverage or InsideEVs are the strongest candidates.
- *Top-of-detail close affordance.* X exists but exact placement / size / contrast TBD.

These don't block the structural work. NCAP and Extras can be drafted as placeholder components and refined when the data lands.

## What's intentionally NOT in v0

| Feature | Status |
|---|---|
| Bonus Écologique link or any subsidy math | dropped (was edge feature, France-specific) |
| Sales-momentum sparkline | v1+ (needs refresh pipeline) |
| Spritmonitor owner-reported data | v1+ (possible link-out only) |
| VS / comparison mode | Phase 5 or cut entirely |
| Trim-by-trim breakdown beyond the envelope | Phase 6 |
| Cross-deck honesty leaderboard (range gap ranking, etc.) | v1+ |
| 0–100 score numerals on stat rows | rejected — hexagon shape IS the scale |
| Bilingual / locale toggle | only if catalogue broadens in a way that demands it |

## Data shape additions per car

Add to each entry in `cars.js`:

```js
verdict: {
  headline: "",           // one-liner, mandatory at v0
  body: "",               // paragraph, optional — collapses when empty
},
realHighwayRange: 320,    // km — what the car actually does at motorway speeds
chargeTime10to80: 28,     // minutes, real-world DC fast charge session
chargeCurve: [            // array of {soc, kw} points
  { soc: 10, kw: 250 },
  { soc: 20, kw: 240 },
  // ...
  { soc: 80, kw: 70 },
],
ncap: {
  stars: 5,
  year: 2024,
},
extras: {
  drive: "RWD",
  weightKg: 1750,
  lengthMm: 4795,
  widthMm: 1850,
  warrantyYears: 4,
  warrantyKm: 80000,
  year: 2024,
},
```

Existing `range` field stays as WLTP for the Range Gap section's comparison. `STAT_CONFIG.range.min/max` updates from (200, 650) to roughly (150, 500) for real-world bounds.

## Implementation order

One weekend per the master plan.

*Saturday AM — wire the navigation.* App-level `selectedCarId` state, `onSelect` prop wired from CarDeck through CarCard to a tap handler on the draggable. Detail view mounts/unmounts on state change. Placeholder content in detail. Confirm tap-vs-drag disambiguation on actual touch hardware.

*Saturday PM — slim the card and build the morph.* Strip `SpecsDivider` and `StatRow.map` from CarCard. Add `layoutId` to photo container and hexagon wrapper. Build the chevron + accent underline below the hex. Wire the shared-element morph between card and detail; static placeholder detail content for now. Get the timing and easing dialled.

*Sunday AM — detail content.* Build CarDetail with the locked layout (Layout B above fold, Sequence A below). Reuse StatRow for the stat readout. New components: RangeGap, ChargeCurve, NcapBadge, ExtrasGrid. Wire to data — accept gaps gracefully (missing verdict body collapses, missing charge curve renders empty state).

*Sunday PM — polish and dismiss.* Tune spring physics. Wire X button + drag-y dismissal. Test on actual phone. Calibrate `STAT_CONFIG.range` bounds against the new real-world figures.

## Data prep before coding

For each of the six current cars, source: real-world highway range (InsideEVs and Bjørn Nyland do real-world tests), charge curve points (Fastned's free open data or A Better Routeplanner), NCAP star rating + year, extras fields. Write a one-liner verdict for each in dry-witty informed-enthusiast voice. Body paragraph optional at v0 — empty is fine, the section collapses.

Six verdicts is an afternoon's writing. Don't ship Phase 4 without them — a prominent empty above-the-fold slot is worse than no slot at all.

# Phase 3 — The deck (v1 shipped)

The atomic card from Phase 2 multiplied: six cars, swipeable stack, looping.

## What's in v1

```
src/
├── App.jsx                    # renders <CarDeck cars={SORTED_CARS} />
├── data/
│   ├── statConfig.js          # unchanged from Phase 2
│   └── cars.js                # 6 cars + sortCars() helper
└── components/
    ├── CarCard.jsx            # unchanged from Phase 2
    ├── CarDeck.jsx            # NEW — stack, swipe, loop
    ├── StatHexagon.jsx        # unchanged
    └── StatRow.jsx            # unchanged
```

`framer-motion` added as a runtime dependency (^12.x). React 19 + Vite 8 — no compat patches needed.

## Decisions

**Six cars, Euro-leaning.** Renault 5 plus the five biggest BEV sellers in Europe across 2024–2025: Tesla Model Y, Volvo EX30, Tesla Model 3, VW ID.3, Škoda Enyaq. Deliberately *not* France-only — the deck should read as "European mainstream", not "French market snapshot". Phase 6 expansion can add halo/quirky cars (Porsche Taycan, BYD Dolphin, Cybertruck) once the spread of stats is wider.

**Default sort: France BEV popularity.** Each car has a `popularity` integer (1 = most popular in France). `sortCars()` in `cars.js` reads from this and is called once in `App.jsx`. Picked over alphabetical because it's opinionated without feeling like a leaderboard, and over a single-stat sort because that would prejudice the radar before the user even swipes. Updating popularity is a small manual chore — worth it for the editorial signal.

**Loop on end of deck.** No empty state in v1. Simplest UX, infinite swiping, lets the user re-encounter cards (the radar shape is the hook — repeated exposure is the *point*). When VS-mode lands in Phase 5 we'll likely add a "swipe up to compare" gesture, at which point an end-of-deck terminus might make sense; not now.

**Stack depth: 3 cards rendered, 2 visible behind the top.** Anything deeper is wasted DOM. Each step back: `scale -5%`, `translateY -12px`, `opacity -15%`. Tuned by eye on a phone-width viewport — the "there's more under this" cue should be obvious without competing with the top card.

**Swipe physics.** Commit threshold is `|offsetX| > 100px` OR `|velocityX| > 500 px/s`. Either of those alone advances the deck. `dragElastic: 0.8` lets the card travel further than the constraint suggests, which feels more tactile than a hard stop. Card flies off in the swipe direction with a small rotation (±18°) and a 350ms cubic-bezier exit.

**No promotion animation between depths.** When the top card exits, the new top card mounts from `depthStyle(1)` — i.e. the position the depth-1 card was sitting in. That makes the next card appear *promoted in place* rather than fading in from nowhere. Real depth-promotion (the same DOM node sliding from depth-1 to depth-0) is a Phase 6 polish task; current behaviour is good enough that the seam is invisible to the eye.

**Container min-height: 720px.** A magic number that approximates the card's rendered height. Necessary because every card is `position: absolute` (so layout doesn't churn during swipe). Worth measuring properly if the card height drifts in Phase 4/5.

## What's intentionally NOT in v1

| Feature | Phase |
|---|---|
| Tap to expand detail view | 4 |
| Two-card overlap (VS mode) | 5 |
| End-of-deck terminus / "you've seen them all" | 5 (paired with VS) |
| Promotion animation between depths | 6 |
| Real photos for the 5 new cars | 6 |
| Calibrated min/max bounds in `statConfig.js` | 6 |
| Onboarding swipe hint / first-run cue | 6 |
| Resolve PRICE axis ambiguity (rename → AFFORDABILITY, or full value score) | later |
| Tighten EFFICIENCY axis sensitivity (real-world spread is ~135–170 Wh/km; current 100–250 bounds flatten meaningful differences) | later |

## Adding photos for the new cars

The CarCard already has the graceful fallback ("Drop a transparent PNG at..."), so the deck ships fine without them. When you have transparent-background PNGs (~800×500, side profile, matching the R5 angle):

1. Drop at `public/cars/<id>.png` matching the `image` path in `cars.js`
2. No code change needed — the `<img>` filter in CarCard normalises every photo

Image filenames in `cars.js`: `tesla-model-y.png`, `volvo-ex30.png`, `tesla-model-3.png`, `vw-id3.png`, `skoda-enyaq.png`.

## Onboarding the next car (Phase 6 prep)

Same pattern as Phase 2's onboarding section — add to the `CARS` array. New required field versus Phase 2: `popularity` (integer, lower = appears earlier in the deck). If you don't care where it ranks, give it the next-highest value past the current max.

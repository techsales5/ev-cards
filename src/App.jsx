// App.jsx
// ---------------------------------------------------------------------------
// Phase 4 entry point.
//
// State model: one piece of state — `selectedCarId`. When non-null, the
// AnimatePresence-wrapped CarDetail mounts on top of the deck; when null, it
// unmounts. The deck is always rendered behind, so layoutId-tracked elements
// (photo, hexagon) can shared-element-morph between card and detail.
// ---------------------------------------------------------------------------

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CARS, sortCars } from "./data/cars";
import { CarDeck } from "./components/CarDeck";
import { CarDetail } from "./components/CarDetail";

const SORTED_CARS = sortCars(CARS);

export default function App() {
  const [selectedCarId, setSelectedCarId] = useState(null);
  const selectedCar = selectedCarId
    ? SORTED_CARS.find((c) => c.id === selectedCarId) ?? null
    : null;

  return (
    <div
      // `min-h-dvh` tracks the *visible* viewport on mobile Safari (shrinks
      // when the URL bar shows, grows when it hides), so the radial gradient
      // always fills the visible page. `min-h-screen` is the fallback for
      // older browsers that don't support dvh.
      className="min-h-screen min-h-dvh flex items-center justify-center px-3 py-6 sm:p-6"
      style={{
        background:
          "radial-gradient(ellipse at top, #1a2030 0%, #050608 70%)",
      }}
    >
      <CarDeck cars={SORTED_CARS} onSelect={setSelectedCarId} />

      <AnimatePresence>
        {selectedCar && (
          <CarDetail
            key={selectedCar.id}
            car={selectedCar}
            onClose={() => setSelectedCarId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

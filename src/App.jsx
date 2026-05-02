// App.jsx
// ---------------------------------------------------------------------------
// Phase 3 entry point — render the deck.
// In Phase 4 a tap on the top card will open the detail view.
// ---------------------------------------------------------------------------

import { CARS, sortCars } from "./data/cars";
import { CarDeck } from "./components/CarDeck";

const SORTED_CARS = sortCars(CARS);

export default function App() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-3 py-6 sm:p-6"
      style={{
        background:
          "radial-gradient(ellipse at top, #1a2030 0%, #050608 70%)",
      }}
    >
      <CarDeck cars={SORTED_CARS} />
    </div>
  );
}

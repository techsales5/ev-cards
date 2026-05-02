// App.jsx
// ---------------------------------------------------------------------------
// Phase 2 entry point — render one card, beautifully.
// In Phase 3 this becomes a stack of cards with swipe gestures.
// ---------------------------------------------------------------------------

import { CARS } from "./data/cars";
import { CarCard } from "./components/CarCard";

export default function App() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(ellipse at top, #1a2030 0%, #050608 70%)",
      }}
    >
      <CarCard car={CARS[0]} />
    </div>
  );
}

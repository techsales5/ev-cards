const car = { name: "Renault 5", range: 312 }

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold">{car.name}</h1>
        <p className="mt-4 text-2xl text-zinc-400">{car.range} km</p>
      </div>
    </div>
  )
}
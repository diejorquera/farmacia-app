import { FarmaciaCard } from "./FarmaciaCard.jsx";

export function FarmaciaResultados({ farmacias }) {
  if (!farmacias || farmacias.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {farmacias.map((f) => (
        <FarmaciaCard key={f.local_id} farmacia={f} />
      ))}
    </div>
  );
}

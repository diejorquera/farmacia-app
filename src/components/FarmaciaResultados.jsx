import { FarmaciaCard } from "./FarmaciaCard.jsx";

export function FarmaciaResultados({ farmacias }) {
  if (!farmacias || farmacias.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4 px-4 md:px-6 lg:px-10 md:-mt-20 pt-6 md:pt-0">
      {farmacias.map((f) => (
        <FarmaciaCard key={f.local_id} farmacia={f} />
      ))}
    </div>
  );
}

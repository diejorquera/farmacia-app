import { REGIONES } from "../utils/regiones";
import { RegionCard } from "./RegionCard";

export function RegionesGrid({ onBuscarRegion }) {
  // Si quieres, también puedes usar useMemo si REGIONES viniera de props.
  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Farmacias de Turno por Región</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {REGIONES.map((r) => (
          <RegionCard
            key={r.id}
            id={r.id}
            nombre={r.nombre}
            imagen={r.imagen}
            onBuscar={onBuscarRegion}
          />
        ))}
      </div>
    </section>
  );
}

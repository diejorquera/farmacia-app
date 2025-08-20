import { REGIONES } from "../utils/regiones";
import { RegionCard } from "./RegionCard";

export function RegionesGrid({ onBuscarRegion }) {
  return (
    <section className="pt-10 px-6 lg:px-0">
      <h2 className="text-2xl md:text-4xl font-bold mb-4 text-brand-dark text-center">Farmacias de Turno por Región</h2>

      <div className="pt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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

import { REGIONES } from "../data/regiones";
import { RegionCard } from "./RegionCard";

export function RegionesGrid() {
  return (
    <section className="pt-3 md:pt-6 px-6 lg:px-0"
    aria-label="Listado de regiones para buscar farmacias de turno en Chile">
      <div className="lg:w-2/3 mx-auto">
        <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-brand-dark text-center">
          Busca farmacias de turno hoy en tu región de Chile: abiertas ahora, cerca de ti y con información oficial del MINSAL.
        </h2>
        <p className="text-center text-brand-muted mb-6">
          Encuentra farmacias abiertas ahora, 24 horas, domingos y feriados, con
          direcciones, teléfonos, horarios actualizados y datos oficiales del
          MINSAL.
        </p>
      </div>

      <div className="pt-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {REGIONES.map((r) => (
          <RegionCard
            key={r.id_api}
            nombre={r.nombre}
            imagen={r.imagen}
            slug={r.slug}
          />
        ))}
      </div>
      
    </section>
  );
}

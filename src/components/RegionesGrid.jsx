// src/components/RegionesGrid.jsx
import { REGIONES } from "../data/regiones";
import { RegionCard } from "./RegionCard";

export function RegionesGrid() {
  return (
    <section className="pt-3 md:pt-6 px-6 lg:px-0">
      <div className="lg:w-2/3 mx-auto">
<h2 className="text-2xl lg:text-4xl font-bold mb-4 text-brand-dark text-center">
Elige tu región y encuentra la farmacia de turno abierta hoy      </h2>
    <p className="text-center text-brand-muted mb-6">
    Selecciona tu región en el mapa o en la lista para ver todas las farmacias de turno abiertas hoy en Chile, organizadas por ciudad y comuna. Encuentra farmacias abiertas ahora, 24 horas, domingos y feriados, con direcciones, teléfonos, horarios actualizados y datos oficiales del MINSAL.
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

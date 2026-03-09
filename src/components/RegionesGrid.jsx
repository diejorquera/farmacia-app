import { useState } from "react";
import { REGIONES } from "../data/regiones";
import { RegionCard } from "./RegionCard";

const FILTROS = [
  { id: "todas",  label: "Todas" },
  { id: "norte",  label: "🌵 Norte" },
  { id: "centro", label: "🌆 Centro" },
  { id: "sur",    label: "🌲 Sur" },
];

export function RegionesGrid() {
  const [zonaActiva, setZonaActiva] = useState("todas");

  const regionesFiltradas =
    zonaActiva === "todas"
      ? REGIONES
      : REGIONES.filter((r) => r.zona === zonaActiva);

  return (
    <section
      className="pt-3 md:pt-6 px-6 lg:px-0"
      aria-label="Listado de regiones para buscar farmacias de turno en Chile"
    >
      <div className="lg:w-2/3 mx-auto">
        <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-brand-dark text-center">
          Busca farmacias de turno hoy en tu región de Chile: abiertas ahora,
          cerca de ti y con información oficial del MINSAL.
        </h2>
        <p className="text-center text-brand-muted mb-6">
          Encuentra farmacias abiertas ahora, 24 horas, domingos y feriados, con
          direcciones, teléfonos, horarios actualizados y datos oficiales del
          MINSAL.
        </p>
      </div>

     {/* Filtros de zona */}
<div className="grid grid-cols-2 sm:flex sm:gap-2 mb-6 gap-2">
  {FILTROS.map((f) => (
    <button
      key={f.id}
      onClick={() => setZonaActiva(f.id)}
      className={`w-full sm:w-auto px-4 py-2 rounded-full text-sm font-semibold border transition-colors duration-150
        ${
          zonaActiva === f.id
            ? "bg-brand-dark text-white border-brand-dark"
            : "bg-white text-brand-muted border-brand-muted/30 hover:border-brand-dark hover:text-brand-dark"
        }`}
    >
      {f.label}
    </button>
  ))}
</div>

      {/* Grid */}
      <div className="pt-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {regionesFiltradas.map((r) => (
          <RegionCard
            key={r.id_api}
            nombre={r.nombre}
            imagen={r.imagen}
            slug={r.slug}
            icono={r.icono}
            comunas={r.comunas}
          />
        ))}
      </div>
    </section>
  );
}
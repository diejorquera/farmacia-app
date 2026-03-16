// src/components/ListaComunas.jsx
import { Link } from "react-router-dom";
import { COMUNAS_CHILE } from "../data/comunas";
import { slugify } from "../utils/slugify";

export default function ListaComunas({ regionId, regionSlug }) {
  const rid = Number(regionId);

  const comunas = COMUNAS_CHILE
    .filter((c) => c.region_id === rid)
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  if (!rid || comunas.length === 0) return null;

  return (
    <div className="w-full">
      <p className="text-xs text-brand-background/70 mb-2 font-medium uppercase tracking-wide">
        Comunas disponibles
      </p>
      <ol className="flex flex-wrap gap-2">
        {comunas.map((c) => {
          const to = regionSlug
            ? `/regiones/${regionSlug}/farmacia-turno-${slugify(c.nombre)}`
            : "/regiones";

          return (
            <li key={c.id}>
              <Link
                to={to}
                className="block px-3 py-1.5 rounded-full bg-white/15 text-brand-background text-sm font-medium
                           border border-white/20 hover:bg-white hover:text-brand-dark transition-colors duration-200"
              >
                {c.nombre}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

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
      <ol className="flex flex-wrap gap-3">
        {comunas.map((c) => {
          const to = regionSlug
            ? `/regiones/${regionSlug}/farmacia-turno-${slugify(c.nombre)}`
            : "/regiones";

          return (
            <li key={c.id}>
              <Link
                to={to}
                className="block px-4 py-2 rounded-md bg-gray-100 text-gray-800 text-sm font-medium
                           hover:bg-brand-dark hover:text-white transition-colors duration-200"
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

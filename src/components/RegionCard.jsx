// src/components/RegionCard.jsx
import { Link } from "react-router-dom";
// 1. Importamos la función track de tu librería de analíticas
import { track } from "../lib/analytics";

export const RegionCard = ({ nombre, imagen, slug, icono, comunas = [] }) => {

  // 2. Función para medir cuando hacen clic en el botón principal
  const handleTrackRegionCompleta = () => {
    track("clic_ver_mas_region", {
      region_nombre: nombre,
      region_slug: slug
    });
  };

  // 3. Función para medir cuando van directo a una comuna
  const handleTrackAccesoComuna = (comunaNombre) => {
    track("clic_acceso_rapido_comuna", {
      region_nombre: nombre,
      comuna_nombre: comunaNombre
    });
  };

  return (
    <div className="bg-brand-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">

      {/* Imagen — solo desktop */}
      <img
        src={imagen}
        alt={`Paisaje de la Región de ${nombre}, Chile, asociada a farmacias de turno`}
        className="hidden md:block w-full h-32 object-cover"
        loading="lazy"
      />

      {/* Icono superpuesto — solo mobile */}
      {icono && (
        <div className="md:hidden relative h-8">
          <span className="absolute -bottom-2 left-3 text-lg w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-brand-muted/10">
            {icono}
          </span>
        </div>
      )}

      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="text-base md:text-lg font-semibold md:text-center leading-tight">
          {`Farmacias de turno hoy en la ${nombre}`}
        </h3>

        {/* Accesos rápidos por comuna */}
        {comunas.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {comunas.map((comuna) => (
              <Link
                key={comuna.slug}
                to={`/regiones/${slug}/${comuna.slug}`}
                // 4. Agregamos el evento al pinchar la comuna
                onClick={() => handleTrackAccesoComuna(comuna.nombre)}
                className="text-xs font-medium text-brand-muted bg-white border border-brand-muted/25 px-2.5 py-1 rounded-full hover:border-brand-dark hover:text-brand-dark transition-colors"
              >
                {comuna.nombre}
              </Link>
            ))}
          </div>
        )}

        <Link
          to={`/regiones/${slug}`}
          // 5. Agregamos el evento al pinchar el botón de ver más
          onClick={handleTrackRegionCompleta}
          className="mt-auto self-center bg-brand-dark font-semibold text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-muted transition-colors text-sm"
        >
          Ver más farmacias
        </Link>

      </div>
    </div>
  );
};
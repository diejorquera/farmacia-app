import { Link } from "react-router-dom";

export const RegionCard = ({ nombre, imagen, slug, icono, comunas = [] }) => {
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
                className="text-xs font-medium text-brand-muted bg-white border border-brand-muted/25 px-2.5 py-1 rounded-full hover:border-brand-dark hover:text-brand-dark transition-colors"
              >
                {comuna.nombre}
              </Link>
            ))}
          </div>
        )}

        <Link
          to={`/regiones/${slug}`}
          className="mt-auto self-center bg-brand-dark font-semibold text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-muted transition-colors text-sm"
        >
          Ver más farmacias
        </Link>

      </div>
    </div>
  );
};
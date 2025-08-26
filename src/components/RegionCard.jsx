import { Link } from "react-router-dom";

export const RegionCard = ({ nombre, imagen, slug }) => {
  return (
    <div className="bg-brand-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <img
        src={imagen}
        alt={nombre}
        className="w-full h-32 object-cover"
        loading="lazy"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold mb-2 text-center">{nombre}</h3>
        <Link
          to={`/regiones/${slug}`}
          className="mt-auto self-center bg-brand-dark font-semibold text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-muted transition-colors"
        >
          Ver farmacias
        </Link>
      </div>
    </div>
  );
};

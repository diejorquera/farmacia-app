import React from "react";

export const RegionCard = React.memo(function RegionCard({ id, nombre, imagen, onBuscar }) {
  return (
    <div className="bg-brand-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <img src={imagen} alt={nombre} className="w-full h-32 object-cover" loading="lazy" />

      <div className="p-4 flex flex-col flex-1">

        <h3 className="text-lg font-semibold mb-2 text-center">
          {nombre}
        </h3>

        <button
          type="button"
          onClick={() => onBuscar?.(id)}
          className="mt-auto self-center bg-brand-dark font-semibold text-white px-4 py-2 md:px-8 rounded hover:bg-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-muted transition-colors duration-200"
        >
          Buscar
        </button>
      </div>
    </div>
  );
});

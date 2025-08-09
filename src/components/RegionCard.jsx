import React from "react";

export const RegionCard = React.memo(function RegionCard({ id, nombre, imagen, onBuscar }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={imagen} alt={nombre} className="w-full h-32 object-cover" loading="lazy" />
      <div className="p-4 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2 text-center">{nombre}</h3>
        <button
          type="button"
          onClick={() => onBuscar?.(id)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>
    </div>
  );
});

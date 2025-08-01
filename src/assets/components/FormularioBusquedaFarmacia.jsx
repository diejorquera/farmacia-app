// src/components/FormularioBusquedaFarmacia.jsx
export function FormularioBusquedaFarmacia({ comunaTexto, setComunaTexto, comunasUnicas, handleBuscar }) {
  return (
    <form onSubmit={handleBuscar} className="mb-6 space-y-4">
      <div>
        <label className="block mb-1 font-medium">Comuna:</label>
        <input
          type="text"
          list="comunas"
          className="border p-2 rounded w-full"
          placeholder="Ej: Talca"
          value={comunaTexto}
          onChange={(e) => setComunaTexto(e.target.value)}
        />
        <datalist id="comunas">
          {comunasUnicas.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Buscar
      </button>
    </form>
  );
}

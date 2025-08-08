export function FormularioBusquedaFarmacia({ comunaTexto, setComunaTexto, comunasUnicas, handleBuscar }) {
  return (
    <form onSubmit={handleBuscar} className="mb-6 space-y-4">
      <div>
        <label className="block mb-1 text-base">🔍 Para encontrar una farmacia de turno, escribe el nombre de tu <span className="font-bold">comuna</span> en el buscador.</label>
        <input
          type="text"
          list="comunas"
          className="border p-2 rounded border-brand-dark w-full focus:outline-none focus:ring-1 focus:ring-brand-dark focus:border-brand-dark"
          placeholder="Escribe el nombre de tu comuna. Ejemplo: Talca"
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
        className="bg-brand-dark font-semibold text-white px-4 py-2 md:px-8 rounded hover:bg-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-muted transition-colors duration-200"
      >
        Buscar
      </button>
    </form>
  );
}

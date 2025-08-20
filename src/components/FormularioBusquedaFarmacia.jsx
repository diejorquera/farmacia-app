import { useEffect, useMemo, useRef, useState } from "react";

export function FormularioBusquedaFarmacia({
  comunaTexto,
  setComunaTexto,
  comunasUnicas,
  handleBuscar,
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Normaliza para comparar sin tildes/diacríticos
  const norm = (s) =>
    (s || "")
      .toString()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  const filtradas = useMemo(() => {
    const q = norm(comunaTexto);
    if (!q) return [];
    // Filtra y limita resultados para no saturar
    return comunasUnicas
      .filter((c) => norm(c).includes(q))
      .slice(0, 12);
  }, [comunaTexto, comunasUnicas]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function onClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setHighlight(-1);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function onChange(e) {
    setComunaTexto(e.target.value);
    setOpen(true);
    setHighlight(-1);
  }

  function onSelect(value) {
    setComunaTexto(value);
    setOpen(false);
    setHighlight(-1);
    // Opcional: enviar el formulario automáticamente al seleccionar
    // handleBuscar?.(new Event("submit"));
  }

  function onKeyDown(e) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtradas.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && highlight >= 0 && filtradas[highlight]) {
        e.preventDefault();
        onSelect(filtradas[highlight]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlight(-1);
    }
  }

  return (
    <form onSubmit={handleBuscar} className="flex flex-col items-center mb-6 space-y-4">
      <div className="w-full lg:w-3/5" ref={wrapperRef}>
        <label className="block mb-2 text-base">
          🔍 Para encontrar una farmacia de turno, escribe el nombre de tu{" "}
          <span className="font-bold">comuna</span> en el buscador.
        </label>

        {/* Contenedor input + botón */}
        <div className="relative flex w-full">
          <input
            ref={inputRef}
            type="text"
            className="border border-brand-dark p-2 w-full rounded-l-md focus:outline-none focus:ring-1 focus:ring-brand-muted"
            placeholder="Escribe el nombre de tu comuna. Ejemplo: Talca"
            value={comunaTexto}
            onChange={onChange}
            onFocus={() => filtradas.length && setOpen(true)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={open}
            aria-controls="lista-comunas"
            aria-autocomplete="list"
            aria-activedescendant={
              highlight >= 0 ? `opcion-comuna-${highlight}` : undefined
            }
            autoComplete="off"
          />

          <button
            type="submit"
            className="bg-brand-dark font-semibold text-white px-6 rounded-r-md hover:bg-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-muted transition-colors duration-200"
          >
            Buscar
          </button>

          {/* Dropdown */}
          {open && filtradas.length > 0 && (
            <ul
              id="lista-comunas"
              role="listbox"
              className="absolute left-0 right-24 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-72 overflow-auto"
            >
              {filtradas.map((c, idx) => (
                <li
                  id={`opcion-comuna-${idx}`}
                  role="option"
                  aria-selected={highlight === idx}
                  key={c}
                  className={`px-3 py-2 cursor-pointer ${
                    highlight === idx ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                  onMouseEnter={() => setHighlight(idx)}
                  onMouseDown={(e) => {
                    // mousedown para evitar perder foco antes del click
                    e.preventDefault();
                    onSelect(c);
                  }}
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </form>
  );
}

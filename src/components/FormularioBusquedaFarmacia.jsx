import { useEffect, useMemo, useRef, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";

export function FormularioBusquedaFarmacia({
  comunaTexto,
  setComunaTexto,
  comunasUnicas,
  handleBuscar,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

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
    return comunasUnicas.filter((c) => norm(c).includes(q)).slice(0, 12);
  }, [comunaTexto, comunasUnicas]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function onClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function onSelect(value) {
    setComunaTexto(value);
    setOpen(false);
  }

  const showClear = Boolean(comunaTexto);

  return (
    <form onSubmit={handleBuscar} className="flex flex-col items-center mb-6 space-y-4">
      <div className="w-full lg:w-3/5" ref={wrapperRef}>
        <div className="relative w-full">
          <Combobox value={comunaTexto} onChange={onSelect} nullable>
            <div className="relative w-full">
              {/* Botón-lupa (envía el formulario) */}
              <button
                type="submit"
                aria-label="Buscar"
                className="absolute inset-y-0 left-0 flex items-center justify-center px-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                // Evita que robe foco de forma extraña
                onMouseDown={(e) => e.preventDefault()}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3m0 0A7 7 0 103.7 3.7a7 7 0 0013 13z" />
                </svg>
              </button>

              <Combobox.Input
                className="h-10 text-sm border-2 border-brand-dark pl-9 pr-8 w-full rounded-md
                           focus:outline-none focus:border-brand-muted"
                placeholder="Escribe el nombre de tu comuna. Ej: Talca"
                displayValue={(v) => v ?? ""}
                onChange={(e) => {
                  setComunaTexto(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => filtradas.length && setOpen(true)}
                aria-label="Buscar comuna"
                autoComplete="off"
              />

              {/* Botón limpiar dentro del input */}
              {showClear && (
                <button
                  type="button"
                  aria-label="Limpiar búsqueda"
                  className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => {
                    setComunaTexto("");
                    setOpen(false);
                  }}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              )}

              <Transition
                show={open && filtradas.length > 0}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setOpen(false)}
              >
                <Combobox.Options
                  static
                  className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-md
                             shadow-lg z-50 max-h-72 overflow-auto"
                >
                  {filtradas.map((c) => (
                    <Combobox.Option
                      key={c}
                      value={c}
                      className={({ active }) =>
                        `px-3 py-2 cursor-pointer ${active ? "bg-gray-100" : "hover:bg-gray-50"}`
                      }
                    >
                      {c}
                    </Combobox.Option>
                  ))}
                  {/* Mensaje sin resultados (por si decides mostrarlo con showAlways) */}
                  {filtradas.length === 0 && comunaTexto && (
                    <div className="px-3 py-2 text-sm text-gray-500">Sin resultados para “{comunaTexto}”.</div>
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>
      </div>
    </form>
  );
}

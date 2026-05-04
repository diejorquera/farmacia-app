import { useState, useRef, useEffect, useCallback, useMemo, useId } from "react";
import { useNavigate } from "react-router-dom";
import { COMUNAS_CHILE } from "../data/comunas.js";
import { REGIONES } from "../data/regiones.js";

// ─── Utilidades ───────────────────────────────────────────────────────────────

/** Normaliza un string para comparación: minúsculas, sin tildes, sin signos. */
function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // quita diacríticos
    .replace(/[^a-z0-9\s]/g, "")      // quita signos como apostrofe
    .trim();
}

/** Convierte un nombre de comuna a slug URL-safe.
 *  "San Pedro De Atacama" → "san-pedro-de-atacama"
 */
function toSlug(nombre = "") {
  return normalize(nombre).replace(/\s+/g, "-");
}

// Mapa de region_id → datos de región (para búsqueda rápida)
const REGION_BY_ID = Object.fromEntries(REGIONES.map((r) => [r.id_api, r]));

// ─── Índice de búsqueda ───────────────────────────────────────────────────────

/**
 * Construye una lista plana de sugerencias con toda la info necesaria.
 * Se calcula una sola vez (fuera del componente → sin recalcular en renders).
 */
const SUGERENCIAS_BASE = [
  // Regiones
  ...REGIONES.map((r) => ({
    tipo: "region",
    label: r.nombre,
    labelNorm: normalize(r.nombre),
    sublabel: "Región",
    icono: r.icono ?? "📍",
    href: `/regiones/${r.slug}`,
  })),
  // Comunas
  ...COMUNAS_CHILE.map((c) => {
    const region = REGION_BY_ID[c.region_id];
    const comunaSlug = toSlug(c.nombre);
    return {
      tipo: "comuna",
      label: c.nombre,
      labelNorm: normalize(c.nombre),
      sublabel: region ? region.nombre : "Chile",
      icono: region?.icono ?? "💊",
      href: region ? `/regiones/${region.slug}/farmacia-turno-${comunaSlug}` : null,
    };
  }).filter((s) => s.href !== null),
];

/** Filtra y ordena sugerencias según la query. Máx. 8 resultados. */
function buscar(query) {
  if (!query || query.trim().length < 2) return [];
  const q = normalize(query);

  const scored = SUGERENCIAS_BASE
    .map((s) => {
      const idx = s.labelNorm.indexOf(q);
      if (idx === -1) return null;
      // Prioridad: coincide al inicio > coincide en medio; regiones antes que comunas
      const score =
        (idx === 0 ? 0 : 1) * 10 +
        (s.tipo === "region" ? 0 : 1);
      return { ...s, score };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || a.label.localeCompare(b.label, "es"));

  return scored.slice(0, 8);
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function FarmaciaBuscadorLocal() {
  const navigate = useNavigate();
  const inputId = useId();
  const listboxId = useId();

  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [indiceFocus, setIndiceFocus] = useState(-1);
  const [abierto, setAbierto] = useState(false);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const containerRef = useRef(null);

  // Recalcula sugerencias cuando cambia la query
  useEffect(() => {
    const res = buscar(query);
    setResultados(res);
    setIndiceFocus(-1);
    setAbierto(res.length > 0);
  }, [query]);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const irA = useCallback(
    (href) => {
      setAbierto(false);
      setQuery("");
      navigate(href);
    },
    [navigate]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!abierto || resultados.length === 0) {
        if (e.key === "Escape") setQuery("");
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setIndiceFocus((i) => Math.min(i + 1, resultados.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setIndiceFocus((i) => Math.max(i - 1, -1));
          break;
        case "Enter":
          e.preventDefault();
          if (indiceFocus >= 0 && resultados[indiceFocus]) {
            irA(resultados[indiceFocus].href);
          } else if (resultados[0]) {
            irA(resultados[0].href);
          }
          break;
        case "Escape":
          e.preventDefault();
          setAbierto(false);
          setIndiceFocus(-1);
          inputRef.current?.focus();
          break;
        case "Tab":
          setAbierto(false);
          break;
      }
    },
    [abierto, resultados, indiceFocus, irA]
  );

  // Scroll automático al ítem con foco
  useEffect(() => {
    if (indiceFocus < 0 || !listRef.current) return;
    const item = listRef.current.children[indiceFocus];
    item?.scrollIntoView({ block: "nearest" });
  }, [indiceFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (indiceFocus >= 0 && resultados[indiceFocus]) {
      irA(resultados[indiceFocus].href);
    } else if (resultados[0]) {
      irA(resultados[0].href);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form
        role="search"
        onSubmit={handleSubmit}
        aria-label="Buscar farmacia por región o comuna"
      >
        <div className="relative flex items-center">
          {/* Ícono lupa */}
          <span
            className="absolute left-4 text-gray-400 pointer-events-none"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </span>

          <label htmlFor={inputId} className="sr-only">
            Buscar región o comuna
          </label>

          <input
            ref={inputRef}
            id={inputId}
            type="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Buscar región o comuna… ej: Talca, Antofagasta"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (resultados.length > 0) setAbierto(true); }}
            role="combobox"
            aria-expanded={abierto}
            aria-controls={listboxId}
            aria-activedescendant={
              indiceFocus >= 0 ? `opcion-${indiceFocus}` : undefined
            }
            aria-autocomplete="list"
            aria-haspopup="listbox"
            className={`
              w-full pl-12 pr-14 py-4
              text-base text-gray-800 placeholder-gray-400
              bg-white border-2
              ${abierto ? "border-brand-dark rounded-t-2xl rounded-b-none" : "border-gray-200 rounded-2xl"}
              shadow-lg focus:outline-none focus:border-brand-dark
              transition-all duration-150
            `}
          />

          {/* Botón limpiar */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setAbierto(false);
                inputRef.current?.focus();
              }}
              aria-label="Limpiar búsqueda"
              className="absolute right-14 text-gray-400 hover:text-gray-600 p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Botón buscar */}
          <button
            type="submit"
            aria-label="Buscar"
            className="
              absolute right-2
              bg-brand-dark font-semibold hover:bg-brand-dark active:bg-brand-dark
              text-white rounded-xl px-3 py-2.5
              transition-colors duration-150 focus:outline-none focus:ring-2 focus:bg-brand-dark focus:rbg-brand-dark
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Dropdown de sugerencias */}
        {abierto && resultados.length > 0 && (
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label="Sugerencias de búsqueda"
            className="
              absolute z-50 w-full bg-white
              border-2 border-t-0 border-brand-dark
              rounded-b-2xl shadow-xl
              overflow-y-auto max-h-80
              divide-y divide-gray-100
            "
          >
            {resultados.map((s, i) => (
              <li
                key={`${s.tipo}-${s.href}`}
                id={`opcion-${i}`}
                role="option"
                aria-selected={i === indiceFocus}
                onMouseDown={(e) => {
                  // mousedown en lugar de click para que no dispare el blur del input
                  e.preventDefault();
                  irA(s.href);
                }}
                onMouseEnter={() => setIndiceFocus(i)}
                className={`
                  flex items-center gap-3 px-4 py-3 cursor-pointer
                  transition-colors duration-100
                  ${i === indiceFocus ? "bg-slate-50" : "hover:bg-gray-50"}
                `}
              >
                {/* Ícono */}
                <span className="text-xl flex-shrink-0" aria-hidden="true">
                  {s.icono}
                </span>

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <HighlightMatch texto={s.label} query={query} />
                  <p className="text-xs text-gray-400 truncate mt-0.5">{s.sublabel}</p>
                </div>

                {/* Badge tipo */}
                <span
                  className={`
                    flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full
                    ${s.tipo === "region"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"}
                  `}
                >
                  {s.tipo === "region" ? "Región" : "Comuna"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}

// ─── Subcomponente: resalta la coincidencia en el texto ───────────────────────

function HighlightMatch({ texto, query }) {
  const partes = useMemo(() => {
    if (!query || query.length < 2) return [{ str: texto, match: false }];
    const textoNorm = normalize(texto);
    const queryNorm = normalize(query);
    const idx = textoNorm.indexOf(queryNorm);
    if (idx === -1) return [{ str: texto, match: false }];

    // Mapea posición en string normalizado → posición aproximada en original
    // Como normalize() puede acortar el string, usamos la longitud de la query norm
    // como aproximación (funciona bien para texto latino con tildes).
    return [
      { str: texto.slice(0, idx), match: false },
      { str: texto.slice(idx, idx + queryNorm.length), match: true },
      { str: texto.slice(idx + queryNorm.length), match: false },
    ].filter((p) => p.str);
  }, [texto, query]);

  return (
    <p className="text-sm font-medium text-gray-800 truncate">
      {partes.map((p, i) =>
        p.match ? (
          <mark
            key={i}
            className="bg-yellow-100 text-yellow-800 rounded-sm px-0.5 not-italic font-semibold"
          >
            {p.str}
          </mark>
        ) : (
          <span key={i}>{p.str}</span>
        )
      )}
    </p>
  );
}

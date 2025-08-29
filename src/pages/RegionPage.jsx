// src/pages/RegionPage.jsx
import { Fragment, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import { slugToRegion } from "../data/regiones";
import { getTurnosPorRegion, getComunasPorRegion } from "../services/farmacias";
import { FarmaciaCard } from "../components/FarmaciaCard";

const SELECT_PLACEHOLDER = "__seleccionar__";
const ALL_VALUE = "__todas__";

export default function RegionPage() {
  const { slug } = useParams();
  const region = slugToRegion[slug];

  const [state, setState] = useState({ loading: false, error: null, items: [] });
  const [comunas, setComunas] = useState([]);
  const [comunasLoaded, setComunasLoaded] = useState(false);
  const [loadingComunas, setLoadingComunas] = useState(false);
  const [comuna, setComuna] = useState(SELECT_PLACEHOLDER); // "Seleccionar…" no carga nada

  // Reset total cuando cambia la región
  useEffect(() => {
    setComuna(SELECT_PLACEHOLDER);
    setState({ loading: false, error: null, items: [] });
    setComunas([]);
    setComunasLoaded(false);
    setLoadingComunas(false);
  }, [region?.id_api]);

  // SEO básico (SPA)
  useEffect(() => {
    if (!region) return;
    document.title = `Farmacias de turno en ${region.nombre} | Farmacias-de-turno.cl`;
    const id = "canonical-link";
    let link = document.querySelector(`link[data-id="${id}"]`);
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      link.setAttribute("data-id", id);
      document.head.appendChild(link);
    }
    link.href = `https://farmacias-de-turno.cl/regiones/${region.slug}`;
  }, [region]);

  // Carga perezosa de comunas
  const ensureComunas = async () => {
    if (!region || comunasLoaded || loadingComunas) return;
    setLoadingComunas(true);
    try {
      const listaComunas = await getComunasPorRegion(region.id_api);
      setComunas(listaComunas);
      setComunasLoaded(true);
    } catch {
      setComunas([]);
      setComunasLoaded(true);
    } finally {
      setLoadingComunas(false);
    }
  };

  // Cargar turnos al elegir "Todas" o una comuna específica
  useEffect(() => {
    let alive = true;

    async function loadTurnos() {
      if (!region) return;
      if (comuna === SELECT_PLACEHOLDER) {
        if (alive) setState({ loading: false, error: null, items: [] });
        return; // no cargamos nada
      }

      setState({ loading: true, error: null, items: [] });
      try {
        const raw = await getTurnosPorRegion(region.id_api);
        let items = raw;

        if (comuna !== ALL_VALUE) {
          const cLower = comuna.toLowerCase();
          items = raw.filter(
            (f) => (f.comuna_nombre ?? f.comuna ?? "").toLowerCase() === cLower
          );
        }

        if (alive) setState({ loading: false, error: null, items });
      } catch {
        if (alive)
          setState({
            loading: false,
            error: "No se pudo cargar la información",
            items: [],
          });
      }
    }

    loadTurnos();
    return () => {
      alive = false;
    };
  }, [region, comuna]);

  if (!region) {
    return (
      <main className="container mx-auto px-4 py-8" id="contenido-principal">
        <p className="mb-4">Región no encontrada.</p>
        <p>
          <Link to="/regiones" className="underline">Volver al listado</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-6" id="contenido-principal">
      {/* Breadcrumbs semánticos */}
      <nav className="text-sm text-brand-muted" aria-label="Ruta de navegación">
        <ol className="flex items-center gap-2 list-none p-0 m-0">
          <li><Link to="/" className="hover:underline">Inicio</Link></li>
          <li aria-hidden="true">›</li>
          <li><Link to="/regiones" className="hover:underline">Regiones</Link></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" className="font-bold text-[#313a44]">{region.nombre}</li>
        </ol>
      </nav>

      {/* Encabezado */}
      <header className="space-y-2">
        <h1 className="text-2xl lg:text-5xl font-bold mb-4 text-brand-dark">
          Farmacias de turno en {region.nombre}
        </h1>
        <p id="descripcion-pagina" className="text-brand-muted">
          Selecciona una comuna o elige “Todas” para cargar resultados.
        </p>
      </header>

      {/* Filtro único (sin botón) */}
      <form
        className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4"
        aria-describedby="descripcion-pagina"
        onSubmit={(e) => e.preventDefault()}
      >
        <fieldset className="contents">
          <legend className="sr-only">Filtro por comuna</legend>

          <div className="w-full md:w-[38%]">
            <label htmlFor="filtro-comuna" className="block text-sm font-medium mb-1">
              Comuna
            </label>

            {/* Reemplazo del <select> por Headless UI Listbox */}
            <Listbox value={comuna} onChange={setComuna}>
              <div className="relative">
                <Listbox.Button
                  id="filtro-comuna"
                  className="w-full border border-brand-dark rounded-md px-3 py-2 bg-white text-left "
                  onClick={ensureComunas} // carga perezosa al abrir
                  aria-controls="lista-resultados conteo-resultados"
                >
                  <span className="block truncate">
                    {comuna === SELECT_PLACEHOLDER
                      ? "Seleccionar…"
                      : comuna === ALL_VALUE
                      ? "Todas"
                      : comuna}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
                    </svg>
                  </span>
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    {/* Placeholder */}
                    <Listbox.Option
                      key={SELECT_PLACEHOLDER}
                      value={SELECT_PLACEHOLDER}
                      className={({ active }) =>
                        `cursor-pointer select-none px-3 py-2 ${active ? "bg-blue-50" : ""}`
                      }
                    >
                      Seleccionar…
                    </Listbox.Option>

                    {/* Opción "Todas" */}
                    <Listbox.Option
                      key={ALL_VALUE}
                      value={ALL_VALUE}
                      className={({ active }) =>
                        `cursor-pointer select-none px-3 py-2 ${active ? "bg-blue-50" : ""}`
                      }
                    >
                      Todas
                    </Listbox.Option>

                    {/* Estado de carga */}
                    {loadingComunas && (
                      <div className="px-3 py-2 text-gray-500">Cargando comunas…</div>
                    )}

                    {/* Comunas cargadas */}
                    {comunasLoaded &&
                      comunas.map((c) => (
                        <Listbox.Option
                          key={c}
                          value={c}
                          className={({ active, selected }) =>
                            [
                              "cursor-pointer select-none px-3 py-2",
                              active ? "bg-blue-50" : "",
                              selected ? "font-semibold" : ""
                            ].join(" ")
                          }
                        >
                          {c}
                        </Listbox.Option>
                      ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </fieldset>
      </form>

      {/* Estado / conteo */}
      <div aria-live="polite" className="min-h-5">
        {!state.loading && !state.error && comuna !== SELECT_PLACEHOLDER && (
          <p id="conteo-resultados" className="text-sm text-gray-600">
            {state.items.length} resultado{state.items.length !== 1 ? "s" : ""}
            {comuna !== ALL_VALUE ? ` en ${comuna}` : ""}.
          </p>
        )}
      </div>

      {/* Contenido */}
      {state.loading && (
        <div
          className="grid gap-6"
          role="status"
          aria-busy="true"
          aria-live="polite"
          aria-label="Cargando farmacias"
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border rounded-md p-4 bg-brand-background shadow-2xl animate-pulse"
            >
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-48 w-full bg-gray-200 rounded mt-4" />
            </div>
          ))}
        </div>
      )}

      {state.error && (
        <p className="text-red-600" role="alert">
          {state.error}
        </p>
      )}

      {!state.loading && !state.error && comuna !== SELECT_PLACEHOLDER && (
        state.items.length ? (
          <section aria-labelledby="titulo-resultados">
            <h2 id="titulo-resultados" className="sr-only">Resultados</h2>
            <ul id="lista-resultados" role="list" className="grid gap-2 md:grid-cols-2">
              {state.items.map((farmacia) => (
                <li
                  key={
                    farmacia.local_id ||
                    farmacia.id_local ||
                    `${farmacia.local_nombre}|${farmacia.local_direccion}`
                  }
                  className="list-none"
                >
                  <FarmaciaCard farmacia={farmacia} />
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p id="lista-resultados" aria-live="polite">
            No hay resultados{comuna !== ALL_VALUE && ` en ${comuna}`}.
          </p>
        )
      )}
    </main>
  );
}

// src/pages/RegionPage.jsx
import { Fragment, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import { slugToRegion } from "../data/regiones";
import { getTurnosPorRegion, getComunasPorRegion } from "../services/farmacias";
import { FarmaciaCard } from "../components/FarmaciaCard";
import Spinner from "../components/Spinner";
import AliAffiliatesCarousel from "../components/AliAffiliatesCarousel";
import { track } from "../lib/analytics";

const SELECT_PLACEHOLDER = "__seleccionar__";
const ALL_VALUE = "__todas__";
// Ajusta si tu dominio final es sin www:
const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";

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

  // SEO básico (SPA): título + canonical
  useEffect(() => {
    if (!region) return;
    document.title = `Farmacias de turno en ${region.nombre} | Farmaciashoy.cl`;

    const id = "canonical-link";
    let link = document.querySelector(`link[data-id="${id}"]`);
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      link.setAttribute("data-id", id);
      document.head.appendChild(link);
    }
    link.href = `${CANONICAL_ORIGIN}/regiones/${region.slug}`;
  }, [region, slug]);

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

  // Evento GA: selección de comuna (incluye "Todas")
  useEffect(() => {
    if (!region) return;
    if (comuna === SELECT_PLACEHOLDER) return; // aún no eligió
    track("seleccionar_comuna", {
      region_slug: region.slug,
      region_nombre: region.nombre,
      comuna: comuna === ALL_VALUE ? "(todas)" : comuna,
    });
  }, [region, comuna]);

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

        // GA: listar resultados (solo cuando termina bien)
        if (alive) {
          track("listar_farmacias", {
            region_slug: region.slug,
            region_nombre: region.nombre,
            comuna: comuna === ALL_VALUE ? "(todas)" : comuna,
            resultados: items.length,
          });
        }
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
      <div className="container mx-auto px-4 py-8" id="contenido-principal">
        <p className="mb-4">Región no encontrada.</p>
        <p>
          <Link to="/regiones" className="underline">Volver al listado</Link>
        </p>
      </div>
    );
  }

  return (
    <>
      {/* HERO / ENCABEZADO con imagen de fondo */}
      <div className="min-h-[202px] md:min-h-[300px] 2xl:min-h-[400px] bg-[url('/img/regionessm.webp')] md:bg-[url('/img/regionesmd.webp')] 2xl:bg-[url('/img/regioneslg.webp')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center py-3 md:py-5">
        <div className="container mx-auto px-4 py-8 space-y-6" id="contenido-principal">
          {/* Breadcrumbs */}
          <nav className="text-sm text-brand-background" aria-label="Ruta de navegación">
            <ol className="flex items-center gap-2 list-none p-0 m-0">
              <li><Link to="/" className="hover:underline text-brand-background">Inicio</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link to="/regiones" className="hover:underline text-brand-background">Regiones</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="font-bold text-white">{region.nombre}</li>
            </ol>
          </nav>

          {/* Encabezado */}
          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl lg:text-5xl font-bold mb-4 text-brand-background">
              Farmacias de turno en {region.nombre}
            </h1>
            <p id="descripcion-pagina" className="text-brand-background">
              Selecciona una comuna o elige “Todas” para cargar resultados.
            </p>
          </div>

          {/* Filtro único (sin botón) */}
          <form
            className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4"
            aria-describedby="descripcion-pagina"
            onSubmit={(e) => e.preventDefault()}
          >
            <fieldset className="contents">
              <legend className="sr-only">Filtro por comuna</legend>

              <div className="w-full md:w-[38%]">
                <label htmlFor="filtro-comuna" className="block text-sm text-white font-medium mb-1">
                  Comuna
                </label>

                <Listbox value={comuna} onChange={setComuna}>
                  <div className="relative">
                    <Listbox.Button
                      id="filtro-comuna"
                      className="w-full border border-brand-dark rounded-md px-3 py-2 bg-white text-left"
                      onClick={ensureComunas}
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
                        <Listbox.Option
                          key={SELECT_PLACEHOLDER}
                          value={SELECT_PLACEHOLDER}
                          className={({ active }) =>
                            `cursor-pointer select-none px-3 py-2 ${active ? "bg-blue-50" : ""}`
                          }
                        >
                          Seleccionar…
                        </Listbox.Option>

                        <Listbox.Option
                          key={ALL_VALUE}
                          value={ALL_VALUE}
                          className={({ active }) =>
                            `cursor-pointer select-none px-3 py-2 ${active ? "bg-blue-50" : ""}`
                          }
                        >
                          Todas
                        </Listbox.Option>

                        {loadingComunas && (
                          <div className="px-3 py-2 text-gray-500 flex items-center gap-2">
                            <Spinner className="w-4 h-4" />
                            Cargando comunas…
                          </div>
                        )}

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
        </div>
      </div>

      <section className="w-full bg-white">
        <AliAffiliatesCarousel />

        <div className="container mx-auto px-4 py-8 space-y-6">
          {/* Estado / conteo */}
          <div aria-live="polite" className="min-h-5">
            {!state.loading && !state.error && comuna !== SELECT_PLACEHOLDER && (
              <p id="conteo-resultados" className="text-sm text-gray-700">
                {state.items.length} resultado{state.items.length !== 1 ? "s" : ""}
                {comuna !== ALL_VALUE ? ` en ${comuna}` : ""}.
              </p>
            )}
          </div>

          {state.loading && (
            <div
              className="grid gap-6"
              role="status"
              aria-busy="true"
              aria-live="polite"
              aria-label="Cargando farmacias"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-md p-4 bg-white shadow animate-pulse">
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
              <div aria-labelledby="titulo-resultados">
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
              </div>
            ) : (
              <p id="lista-resultados" aria-live="polite">
                No hay resultados{comuna !== ALL_VALUE && ` en ${comuna}`}.
              </p>
            )
          )}
        </div>
      </section>
    </>
  );
}

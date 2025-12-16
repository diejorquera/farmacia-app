// src/pages/ComunaPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { slugToRegion } from "/src/utils/catalogo.js";
import { COMUNAS_CHILE } from "../data/comunas";
import { getTurnosPorRegion } from "../services/farmacias";
import { FarmaciaCard } from "../components/FarmaciaCard";
import { track } from "../lib/analytics";
import { slugify } from "../utils/slugify";

const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";
const PREFIX = "farmacia-turno-";

export default function ComunaPage() {
  const { regionSlug, comunaToken } = useParams();

  const region = slugToRegion[regionSlug];

  // comunaToken viene como: "farmacia-turno-coelemu"
  const comunaSlug = useMemo(() => {
    if (!comunaToken) return null;
    if (!comunaToken.startsWith(PREFIX)) return null; // no es una comuna válida
    const s = comunaToken.slice(PREFIX.length);
    return s || null;
  }, [comunaToken]);

  const comuna = useMemo(() => {
    if (!region || !comunaSlug) return null;
    const rid = Number(region.id_api);

    return (
      COMUNAS_CHILE.find(
        (c) => c.region_id === rid && slugify(c.nombre) === comunaSlug
      ) || null
    );
  }, [region, comunaSlug]);

  const [state, setState] = useState({
    loading: false,
    error: null,
    items: [],
  });

  useEffect(() => {
    setState({ loading: false, error: null, items: [] });
  }, [regionSlug, comunaToken]);

  // SEO: title + canonical
  useEffect(() => {
    if (!region || !comuna || !comunaSlug) return;

    document.title = `Farmacias de turno en ${comuna.nombre}, ${region.nombre} | FarmaciasHoy.cl`;

    const id = "canonical-link";
    let link = document.querySelector(`link[data-id="${id}"]`);
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      link.setAttribute("data-id", id);
      document.head.appendChild(link);
    }

    link.href = `${CANONICAL_ORIGIN}/regiones/${regionSlug}/${PREFIX}${comunaSlug}`;
  }, [region, comuna, regionSlug, comunaSlug]);

  // Load turnos y filtrar por comuna
  useEffect(() => {
    let alive = true;

    async function load() {
      if (!region || !comuna) return;

      setState({ loading: true, error: null, items: [] });

      try {
        const raw = await getTurnosPorRegion(region.id_api);
   const targetSlug = slugify(comuna.nombre);

   const items = raw.filter((f) => {
  const apiName = (f.comuna_nombre ?? f.comuna ?? "").trim();
  return slugify(apiName) === targetSlug;
});

        if (!alive) return;

        setState({ loading: false, error: null, items });

        track("listar_farmacias", {
          region_slug: region.slug,
          region_nombre: region.nombre,
          comuna: comuna.nombre,
          resultados: items.length,
        });
      } catch {
        if (!alive) return;
        setState({
          loading: false,
          error: "No se pudo cargar la información",
          items: [],
        });
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [region, comuna]);

  // 404s amables
  if (!region) {
    return (
      <div className="container mx-auto px-4 py-8" id="contenido-principal">
        <p className="mb-4">Región no encontrada.</p>
        <Link to="/regiones" className="underline">
          Volver al listado
        </Link>
      </div>
    );
  }

  if (!comunaSlug) {
    return (
      <div className="container mx-auto px-4 py-8" id="contenido-principal">
        <p className="mb-4">URL de comuna no válida.</p>
        <Link to={`/regiones/${region.slug}`} className="underline">
          Volver a {region.nombre}
        </Link>
      </div>
    );
  }

  if (!comuna) {
    return (
      <div className="container mx-auto px-4 py-8" id="contenido-principal">
        <p className="mb-4">
          Comuna no encontrada para {region.nombre}: <b>{comunaSlug}</b>
        </p>
        <Link to={`/regiones/${region.slug}`} className="underline">
          Volver a {region.nombre}
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <div className="min-h-[202px] md:min-h-[300px] 2xl:min-h-[400px] bg-[url('/img/regionessm.webp')] md:bg-[url('/img/regionesmd.webp')] 2xl:bg-[url('/img/regioneslg.webp')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center py-3 md:py-5">
        <div className="container mx-auto px-4 py-8 space-y-6" id="contenido-principal">
          {/* Breadcrumbs */}
          <nav
            className="text-sm text-brand-background"
            aria-label="Ruta de navegación"
          >
            <ol className="flex items-center gap-2 list-none p-0 m-0">
              <li>
                <Link to="/" className="hover:underline text-brand-background">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link
                  to="/regiones"
                  className="hover:underline text-brand-background"
                >
                  Regiones
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link
                  to={`/regiones/${region.slug}`}
                  className="hover:underline text-brand-background"
                >
                  {region.nombre}
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="font-bold text-white">
                {comuna.nombre}
              </li>
            </ol>
          </nav>

          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl lg:text-5xl font-bold mb-4 text-brand-background">
              Farmacias de turno en {comuna.nombre}
            </h1>
            <p className="text-brand-background">
              Región: {region.nombre}. Resultados del turno del día según MINSAL.
            </p>
          </div>
        </div>
      </div>

      <section className="w-full bg-white">
        <div className="container mx-auto px-4 py-8 space-y-6">
          {!state.loading && !state.error && (
            <p className="text-sm text-gray-700">
              {state.items.length} resultado{state.items.length !== 1 ? "s" : ""}{" "}
              en {comuna.nombre}.
            </p>
          )}

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
                  className="border rounded-md p-4 bg-white shadow animate-pulse"
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

          {!state.loading && !state.error && (
            state.items.length ? (
              <ul role="list" className="grid gap-2 md:grid-cols-2">
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
            ) : (
              <p aria-live="polite">No hay resultados en {comuna.nombre}.</p>
            )
          )}
        </div>
      </section>
    </>
  );
}

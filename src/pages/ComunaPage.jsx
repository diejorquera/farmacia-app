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

function buildFaqItems({ regionNombre, comunaNombre, otrasComunas }) {
  const ejemplos = (otrasComunas || []).slice(0, 6).join(", ");

  return [
    {
      q: `¿Dónde puedo encontrar la farmacia de turno en ${comunaNombre}?`,
      a: `En esta página puedes revisar el listado de farmacias de turno para ${comunaNombre}. Si hoy no aparece ninguna, revisa comunas cercanas de ${regionNombre} desde el enlace “Ver todas las comunas de la región”.`,
    },
    {
      q: `¿Por qué hoy no aparece ninguna farmacia de turno en ${comunaNombre}?`,
      a: `Los turnos cambian día a día y dependen del listado oficial publicado para cada comuna. Si hoy no hay resultados en ${comunaNombre}, puede que el turno esté asignado a otra comuna cercana o que no se haya informado un local para esta fecha.`,
    },
    {
      q: `¿Cómo consulto el listado actualizado de farmacias de turno en mi región?`,
      a: `Entra a la página de la región ${regionNombre} y elige “Todas” o selecciona una comuna específica para ver direcciones, horarios y teléfonos.`,
    },
    {
      q: "¿Las farmacias de turno atienden 24/7?",
      a: `No necesariamente. Que una farmacia esté “de turno” no implica que atienda toda la noche. Revisa el horario de apertura y cierre que aparece en cada resultado.`,
    },
    {
      q: "¿Puedo llamar para reservar o confirmar stock?",
      a: `Depende de cada farmacia. Si el listado incluye teléfono, lo recomendable es llamar para confirmar stock y disponibilidad antes de ir.`,
    },
    {
      q: "¿Dónde puedo ver reseñas o calificaciones de una farmacia?",
      a: `Las reseñas suelen estar en servicios de mapas y directorios. Aquí mostramos la información del turno del día y datos de contacto; luego puedes complementar con reseñas externas si lo necesitas.`,
    },
    {
      q: `¿Qué comunas cercanas puedo revisar si no hay turnos en ${comunaNombre}?`,
      a: ejemplos
        ? `Puedes probar con comunas de ${regionNombre} como: ${ejemplos}.`
        : `Puedes revisar otras comunas dentro de ${regionNombre} desde el listado de comunas de la región.`,
    },
  ];
}

export default function ComunaPage() {
  const { regionSlug, comunaToken } = useParams();

  const region = slugToRegion[regionSlug];

  // comunaToken viene como: "farmacia-turno-talca"
  const comunaSlug = useMemo(() => {
    if (!comunaToken) return null;
    if (!comunaToken.startsWith(PREFIX)) return null;
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

  const comunasDeRegion = useMemo(() => {
    if (!region) return [];
    const rid = Number(region.id_api);
    return COMUNAS_CHILE
      .filter((c) => c.region_id === rid)
      .slice()
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }, [region]);

  const otrasComunasNombres = useMemo(() => {
    if (!comuna) return comunasDeRegion.map((c) => c.nombre);
    return comunasDeRegion
      .filter((c) => c.id !== comuna.id)
      .map((c) => c.nombre);
  }, [comunasDeRegion, comuna]);

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

  // Cargar turnos y filtrar por comuna (robusto a MAYÚSCULAS/acentos)
  useEffect(() => {
    let alive = true;

    async function load() {
      if (!region || !comuna) return;

      setState({ loading: true, error: null, items: [] });

      try {
        const raw = await getTurnosPorRegion(region.id_api);

        const targetSlug = slugify(comuna.nombre);

        const items = raw.filter((f) => {
          const apiName = (f.comuna_nombre ?? f.comuna ?? "").toString().trim();
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

  // FAQ (visible + JSON-LD) — siempre que exista region + comuna
  const faqItems = useMemo(() => {
    if (!region || !comuna) return [];
    return buildFaqItems({
      regionNombre: region.nombre,
      comunaNombre: comuna.nombre,
      otrasComunas: otrasComunasNombres,
    });
  }, [region, comuna, otrasComunasNombres]);

  useEffect(() => {
    if (!region || !comuna || !faqItems.length) return;

    const scriptId = "faq-jsonld";
    const prev = document.getElementById(scriptId);
    if (prev) prev.remove();

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    };

    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = scriptId;
    s.text = JSON.stringify(jsonLd);
    document.head.appendChild(s);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [region, comuna, faqItems]);

  // “404s amables” (pero ojo: esto es UI, no status real en SPA)
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

  const regionLink = `/regiones/${region.slug}`;

  return (
    <>
      {/* HERO */}
      <div className="min-h-[202px] md:min-h-[300px] 2xl:min-h-[400px] bg-[url('/img/regionessm.webp')] md:bg-[url('/img/regionesmd.webp')] 2xl:bg-[url('/img/regioneslg.webp')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center py-3 md:py-5">
        <div
          className="container mx-auto px-4 py-8 space-y-6"
          id="contenido-principal"
        >
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
                  to={regionLink}
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
              Región: {region.nombre}. Resultados del turno del día según el listado
              publicado por la autoridad sanitaria.
            </p>
          </div>
        </div>
      </div>

      <section className="w-full bg-white">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Conteo */}
          {!state.loading && !state.error && (
            <p className="text-sm text-gray-700">
              {state.items.length} resultado{state.items.length !== 1 ? "s" : ""}{" "}
              en {comuna.nombre}.
            </p>
          )}

          {/* Loading */}
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

          {/* Error */}
          {state.error && (
            <p className="text-red-600" role="alert">
              {state.error}
            </p>
          )}

          {/* Resultados / Empty State “SEO-friendly” */}
          {!state.loading && !state.error && (
            <>
              {state.items.length ? (
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
                <div className="rounded-md border bg-white p-5 space-y-4">
                  <p className="text-gray-800">
                    Según la información publicada para hoy, no encontramos una
                    farmacia de turno informada en <b>{comuna.nombre}</b>.
                  </p>

                  <p className="text-gray-700">
                    Puedes buscar en una comuna cercana dentro de la región de{" "}
                    <b>{region.nombre}</b> o ver el listado completo de comunas.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={regionLink}
                      className="inline-flex items-center rounded-md bg-brand-dark px-4 py-2 text-white font-semibold hover:opacity-90"
                    >
                      Ver todas las comunas de {region.nombre}
                    </Link>

                    <a
                      href="#comunas-region"
                      className="inline-flex items-center rounded-md border px-4 py-2 text-brand-dark font-semibold hover:bg-gray-50"
                    >
                      Ir al listado de comunas
                    </a>
                  </div>

                  <div id="comunas-region" className="pt-2">
                    <h2 className="text-lg font-bold text-brand-dark">
                      Comunas de {region.nombre}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Elige una comuna para revisar si hay turnos informados hoy.
                    </p>

                    <ol className="mt-4 flex flex-wrap gap-2">
                      {comunasDeRegion.map((c) => {
                        const href = `/regiones/${region.slug}/${PREFIX}${slugify(
                          c.nombre
                        )}`;
                        const isCurrent = c.id === comuna.id;

                        return (
                          <li key={c.id} className="list-none">
                            <Link
                              to={href}
                              className={[
                                "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isCurrent
                                  ? "bg-brand-dark text-white"
                                  : "bg-gray-100 text-gray-800 hover:bg-brand-dark hover:text-white",
                              ].join(" ")}
                              aria-current={isCurrent ? "page" : undefined}
                            >
                              {c.nombre}
                            </Link>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              )}

              {/* FAQ visible */}
              <section aria-labelledby="faq-title" className="border-t pt-8">
                <h2
                  id="faq-title"
                  className="text-xl md:text-2xl font-bold text-brand-dark"
                >
                  Preguntas frecuentes sobre farmacias de turno en {comuna.nombre}
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  Respuestas rápidas para encontrar farmacias de turno hoy en{" "}
                  {comuna.nombre} y comunas cercanas de {region.nombre}.
                </p>

                <div className="mt-6 space-y-4">
                  {faqItems.map((item, idx) => (
                    <details key={idx} className="rounded-md border bg-white p-4">
                      <summary className="cursor-pointer font-semibold text-brand-dark">
                        {item.q}
                      </summary>
                      <p className="mt-2 text-gray-700">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>

              {/* Link final “SEO / UX” */}
              <div className="pt-2">
                <Link to={regionLink} className="underline text-brand-dark">
                  Volver a la región {region.nombre} para ver todas las comunas
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

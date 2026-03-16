// src/pages/ComunaPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useLoaderData } from "react-router";
import { slugToRegion } from "../utils/catalogo.js";
import { COMUNAS_CHILE } from "../data/comunas";
import { getTurnosPorRegion } from "../services/farmacias";
import { FarmaciaCard } from "../components/FarmaciaCard";
import { track } from "../lib/analytics";
import { slugify } from "../utils/slugify";

const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";
const PREFIX = "farmacia-turno-";

// ─── LOADER ───────────────────────────────────────────────────────────────────
export async function loader({ params }) {
  const region = slugToRegion[params.regionSlug] ?? null;

  const comunaSlug = params.comunaToken?.startsWith(PREFIX)
    ? params.comunaToken.slice(PREFIX.length)
    : null;

  const comuna = region && comunaSlug
    ? COMUNAS_CHILE.find(
        (c) =>
          c.region_id === Number(region.id_api) &&
          slugify(c.nombre) === comunaSlug
      ) ?? null
    : null;

  const comunasDeRegion = region
    ? COMUNAS_CHILE
        .filter((c) => c.region_id === Number(region.id_api))
        .slice()
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    : [];

  return { region, comuna, comunaSlug, comunasDeRegion };
}

// ─── META ─────────────────────────────────────────────────────────────────────
export function meta({ data }) {
  if (!data?.region || !data?.comuna) return [];

  const { region, comuna, comunaSlug } = data;
  const url = `${CANONICAL_ORIGIN}/regiones/${region.slug}/${PREFIX}${comunaSlug}`;
  const title = `Farmacias de turno en ${comuna.nombre}, ${region.nombre} | FarmaciasHoy.cl`;
  const description = `Consulta qué farmacias están de turno hoy en ${comuna.nombre}, región de ${region.nombre}. Direcciones, horarios y teléfonos actualizados.`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url,
    description,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: CANONICAL_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Regiones", item: `${CANONICAL_ORIGIN}/regiones` },
        { "@type": "ListItem", position: 3, name: region.nombre, item: `${CANONICAL_ORIGIN}/regiones/${region.slug}` },
        { "@type": "ListItem", position: 4, name: `Farmacia turno ${comuna.nombre}`, item: url },
      ],
    },
  };

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { "script:ld+json": webPageSchema },
  ];
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function buildFaqItems({ regionNombre, comunaNombre, otrasComunas }) {
  const ejemplos = (otrasComunas || []).slice(0, 6).join(", ");
  return [
    {
      q: `¿Dónde puedo encontrar la farmacia de turno en ${comunaNombre}?`,
      a: `En esta página puedes revisar el listado de farmacias de turno para ${comunaNombre}. Si hoy no aparece ninguna, revisa comunas cercanas de ${regionNombre} desde el enlace "Volver a ${regionNombre}".`,
    },
    {
      q: `¿Por qué hoy no aparece ninguna farmacia de turno en ${comunaNombre}?`,
      a: `Los turnos cambian día a día y dependen del listado oficial publicado para cada comuna. Si hoy no hay resultados en ${comunaNombre}, puede que el turno esté asignado a otra comuna cercana o que no se haya informado un local para esta fecha.`,
    },
    {
      q: `¿Cómo consulto el listado actualizado de farmacias de turno en mi región?`,
      a: `Entra a la página de la región ${regionNombre} y elige "Todas" o selecciona una comuna específica para ver direcciones, horarios y teléfonos.`,
    },
    {
      q: "¿Las farmacias de turno atienden 24/7?",
      a: `No necesariamente. Que una farmacia esté "de turno" no implica que atienda toda la noche. Revisa el horario de apertura y cierre que aparece en cada resultado.`,
    },
    {
      q: "¿Puedo llamar para reservar o confirmar stock?",
      a: `Depende de cada farmacia. Si el listado incluye teléfono, lo recomendable es llamar para confirmar stock y disponibilidad antes de ir.`,
    },
    {
      q: `¿Qué farmacia está de turno hoy en ${comunaNombre}?`,
      a: `Para ver las farmacias de turno hoy en ${comunaNombre}, revisa el listado en esta misma página. Si no hay resultados, puede que no se haya informado un local para hoy o que el turno esté asignado a otra comuna cercana.`,
    },
    {
      q: `¿Qué comunas cercanas puedo revisar si no hay turnos en ${comunaNombre}?`,
      a: ejemplos
        ? `Puedes probar con comunas de ${regionNombre} como: ${ejemplos}.`
        : `Puedes revisar otras comunas dentro de ${regionNombre} desde el listado de comunas de la región.`,
    },
  ];
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
export default function ComunaPage() {
  const { region, comuna, comunaSlug, comunasDeRegion } = useLoaderData();
  const { regionSlug, comunaToken } = useParams();

  const otrasComunasNombres = useMemo(() => {
    if (!comuna) return comunasDeRegion.map((c) => c.nombre);
    return comunasDeRegion.filter((c) => c.id !== comuna.id).map((c) => c.nombre);
  }, [comunasDeRegion, comuna]);

  const [state, setState] = useState({ loading: false, error: null, items: [] });

  useEffect(() => {
    setState({ loading: false, error: null, items: [] });
  }, [regionSlug, comunaToken]);

  // Cargar turnos
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
        setState({ loading: false, error: null, items: [] });
      }
    }
    load();
    return () => { alive = false; };
  }, [region, comuna]);

  // FAQ JSON-LD
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
        acceptedAnswer: { "@type": "Answer", text: item.a },
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

  // 404s amables
  if (!region) {
    return (
      <div className="container mx-auto px-4 py-8" id="contenido-principal">
        <p className="mb-4">Región no encontrada.</p>
        <Link to="/regiones" className="underline">Volver al listado</Link>
      </div>
    );
  }
  if (!comunaSlug) {
    return (
      <div className="container mx-auto px-4 py-8" id="contenido-principal">
        <p className="mb-4">URL de comuna no válida.</p>
        <Link to={`/regiones/${region.slug}`} className="underline">Volver a {region.nombre}</Link>
      </div>
    );
  }
  if (!comuna) {
    return (
      <div className="container mx-auto px-4 py-8" id="contenido-principal">
        <p className="mb-4">Comuna no encontrada para {region.nombre}: <b>{comunaSlug}</b></p>
        <Link to={`/regiones/${region.slug}`} className="underline">Volver a {region.nombre}</Link>
      </div>
    );
  }

  const regionLink = `/regiones/${region.slug}`;

  return (
    <>
      {/* HERO */}
      <div className="min-h-[202px] md:min-h-[300px] 2xl:min-h-[400px] bg-[url('/img/regionessm.webp')] md:bg-[url('/img/regionesmd.webp')] 2xl:bg-[url('/img/regioneslg.webp')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center py-3 md:py-5">
        <div className="container mx-auto px-4 py-8 space-y-6" id="contenido-principal">

          {/* Breadcrumb */}
          <nav className="text-sm text-brand-background" aria-label="Ruta de navegación">
            <ol className="flex items-center gap-1.5 list-none p-0 m-0 flex-wrap">
              <li><Link to="/" className="hover:underline text-brand-background/80">Inicio</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link to="/regiones" className="hover:underline text-brand-background/80">Regiones</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link to={regionLink} className="hover:underline text-brand-background/80">{region.nombre}</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="font-bold text-white">{comuna.nombre}</li>
            </ol>
          </nav>

          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl lg:text-5xl font-bold mb-3 text-brand-background">
              Farmacias de turno hoy en {comuna.nombre}
            </h1>
            <p className="text-brand-background/90 text-sm md:text-base">
              Consulta las farmacias de turno disponibles en {comuna.nombre},{" "}
              {region.nombre}, según el listado publicado por la autoridad sanitaria.
            </p>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 py-6 md:py-8 space-y-6">

          {/* Conteo */}
          {!state.loading && !state.error && (
            <p className="text-sm font-medium text-brand-muted">
              {state.items.length > 0
                ? `${state.items.length} farmacia${state.items.length !== 1 ? "s" : ""} de turno hoy en ${comuna.nombre}`
                : `Sin farmacias de turno informadas hoy en ${comuna.nombre}`}
            </p>
          )}

          {/* Skeleton loader */}
          {state.loading && (
            <div className="grid gap-4 md:grid-cols-2" role="status" aria-busy="true" aria-live="polite" aria-label="Cargando farmacias">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-brand-background rounded-xl p-4 bg-white animate-pulse">
                  <div className="h-5 w-1/2 bg-brand-muted/20 rounded mb-3" />
                  <div className="h-4 w-3/4 bg-brand-muted/20 rounded mb-2" />
                  <div className="h-4 w-1/3 bg-brand-muted/20 rounded" />
                  <div className="h-24 w-full bg-brand-muted/20 rounded mt-4" />
                </div>
              ))}
            </div>
          )}

          {state.error && (
            <p className="text-red-600 text-sm" role="alert">{state.error}</p>
          )}

          {!state.loading && !state.error && (
            <>
              {/* Lista de farmacias */}
              {state.items.length ? (
                <ul role="list" className="grid gap-3 md:grid-cols-2">
                  {state.items.map((farmacia) => (
                    <li
                      key={farmacia.local_id || farmacia.id_local || `${farmacia.local_nombre}|${farmacia.local_direccion}`}
                      className="list-none"
                    >
                      <FarmaciaCard farmacia={farmacia} />
                    </li>
                  ))}
                </ul>
              ) : (
                /* Estado vacío */
                <div className="rounded-xl border border-brand-background bg-brand-background/40 p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 border border-brand-background">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-brand-dark">
                        Sin turno informado hoy en {comuna.nombre}
                      </p>
                      <p className="text-sm text-brand-muted mt-1">
                        Puede que el turno esté asignado a otra comuna cercana o que no se haya publicado un local para esta fecha.
                      </p>
                    </div>
                  </div>
                  <Link
                    to={regionLink}
                    className="inline-flex items-center justify-center rounded-xl bg-brand-dark px-4 py-2.5 text-sm text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    Ver otras comunas de {region.nombre}
                  </Link>
                </div>
              )}

              {/* FAQ */}
              <section aria-labelledby="faq-title" className="border-t border-brand-background pt-6">
                <h2 id="faq-title" className="text-xl md:text-2xl font-bold text-brand-dark">
                  Preguntas frecuentes sobre farmacias de turno en {comuna.nombre}
                </h2>
                <p className="mt-2 text-sm text-brand-muted leading-relaxed">
                  Estas farmacias permanecen abiertas fuera del horario habitual para atender
                  urgencias durante la noche, fines de semana y festivos.
                </p>
                <div className="mt-5 rounded-xl border border-brand-background overflow-hidden divide-y divide-brand-background">
                  {faqItems.map((item, idx) => (
                    <details key={idx} className="group bg-white">
                      <summary className="flex items-center justify-between gap-4 cursor-pointer px-4 py-4 list-none select-none">
                        <span className="font-medium text-brand-dark">{item.q}</span>
                        <span className="text-lg text-brand-muted shrink-0 transition-transform duration-200 group-open:rotate-45">+</span>
                      </summary>
                      <p className="px-4 pb-4 text-sm text-brand-muted leading-relaxed">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>

              {/* Volver */}
              <div className="pt-2 pb-4">
                <Link
                  to={regionLink}
                  className="inline-flex items-center gap-1.5 text-sm text-brand-dark hover:underline"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Volver a {region.nombre}
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

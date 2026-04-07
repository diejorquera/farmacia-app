// src/pages/ComunaPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLoaderData } from "react-router";
import { slugToRegion } from "../utils/catalogo.js";
import { COMUNAS_CHILE } from "../data/comunas";
import { getTurnosPorRegion, getTodosLosLocalesPorRegion } from "../services/farmacias";
import { FarmaciaCard } from "../components/FarmaciaCard";
import { track } from "../lib/analytics";
import { slugify } from "../utils/slugify";

const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";
const PREFIX = "farmacia-turno-";

// Helper para limpiar segundos
const formatTime = (t) => t?.slice(0, 5) || "";

// Limpia números de teléfono
const cleanPhone = (raw) => {
  if (!raw) return null;
  let digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("56")) digits = digits.slice(2);
  digits = digits.replace(/^0+/, "");
  if (digits.length < 8 || digits.length > 9) return null;
  return `+56${digits}`;
};

// Determina estado de apertura
const isOpenNow = (apertura, cierre) => {
  if (!apertura || !cierre) return null;
  const now = new Date();
  const toMinutes = (t) => {
    const [h, m] = t.slice(0, 5).split(":").map(Number);
    return h * 60 + m;
  };
  const current = now.getHours() * 60 + now.getMinutes();
  const open = toMinutes(apertura);
  let close = toMinutes(cierre);
  if (close === 0 || close < open) close += 24 * 60;
  return current >= open && current < close;
};

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

// ─── META (SEO) ───────────────────────────────────────────────────────────────
export function meta({ data }) {
  // Cláusula de guarda para evitar errores si no hay datos
  if (!data?.region || !data?.comuna) {
    return [{ title: "Farmacia de Turno | FarmaciasHoy.cl" }];
  }

  const { region, comuna } = data;
  const comunaNombre = comuna.nombre;
  const regionNombre = region.nombre;
  const canonicalUrl = `${CANONICAL_ORIGIN}/regiones/${region.slug}/${PREFIX}${slugify(comunaNombre)}`;

  // Título con guion largo para limpieza visual
  const title = `Farmacia de Turno – ${comunaNombre} Hoy`;
  
  // Tu descripción optimizada
  const description = `Farmacia de turno en ${comunaNombre} hoy. Direcciones, teléfonos y horarios actualizados de locales abiertos en la ${regionNombre}. Datos oficiales MINSAL.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": title,
    "description": description,
    "url": canonicalUrl,
    "lastReviewed": new Date().toISOString().split('T')[0],
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": CANONICAL_ORIGIN },
        { "@type": "ListItem", "position": 2, "name": regionNombre, "item": `${CANONICAL_ORIGIN}/regiones/${region.slug}` },
        { "@type": "ListItem", "position": 3, "name": comunaNombre, "item": canonicalUrl }
      ]
    }
  };

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { "script:ld+json": jsonLd },
  ];
}

// ─── FAQ BUILDER ──────────────────────────────────────────────────────────────
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

export default function ComunaPage() {
  const { region, comuna, comunasDeRegion } = useLoaderData();
  const [state, setState] = useState({ loading: true, error: null, turnos: [], comunes: [] });

  const otrasComunasNombres = useMemo(() => {
    if (!comuna) return comunasDeRegion.map((c) => c.nombre);
    return comunasDeRegion.filter((c) => c.id !== comuna.id).map((c) => c.nombre);
  }, [comunasDeRegion, comuna]);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!region || !comuna) return;
      setState({ loading: true, error: null, turnos: [], comunes: [] });
      try {
        const targetSlug = slugify(comuna.nombre);
        const [rawTurnos, rawTodos] = await Promise.all([
          getTurnosPorRegion(region.id_api),
          getTodosLosLocalesPorRegion(region.id_api)
        ]);

        if (!alive) return;

        const turnos = rawTurnos.filter(f => slugify(f.comuna_nombre || f.comuna || "") === targetSlug);
        const todos = rawTodos.filter(f => slugify(f.comuna_nombre || f.comuna || "") === targetSlug);

        const idsTurno = new Set(turnos.map(t => t.local_id || t.id_local || t.local_direccion));
        const comunes = todos.filter(f => !idsTurno.has(f.local_id || f.id_local || f.local_direccion));

        setState({ loading: false, error: null, turnos, comunes });
      } catch {
        if (alive) setState({ loading: false, error: "Error", turnos: [], comunes: [] });
      }
    }
    load();
    return () => { alive = false; };
  }, [region, comuna]);

  const faqItems = useMemo(() => {
    if (!region || !comuna) return [];
    return buildFaqItems({ 
      regionNombre: region.nombre, 
      comunaNombre: comuna.nombre, 
      otrasComunas: otrasComunasNombres 
    });
  }, [region, comuna, otrasComunasNombres]);

  if (!region || !comuna) return <div className="p-10 text-center">Cargando información...</div>;

  return (
    <>
      {/* HEADER CON H1 OPTIMIZADO */}
      <div className="min-h-[220px] min-h-[220px] bg-[url('/img/regionessm.webp')] md:bg-[url('/img/regionesmd.webp')] 2xl:bg-[url('/img/regioneslg.webp')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center py-8 text-white"> 
        <div className="container mx-auto px-4">
          <h1 className="text-2xl lg:text-5xl font-bold mb-3">Farmacia de Turno – {comuna.nombre} Hoy</h1>
          <nav className="text-sm opacity-80" aria-label="Breadcrumb">
            <Link to="/" className="hover:underline">Inicio</Link> › <Link to="/regiones" className="hover:underline">Regiones</Link> › <Link to={`/regiones/${region.slug}`} className="hover:underline">{region.nombre}</Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        
        {/* SECCIÓN TURNOS */}
        <section aria-labelledby="turnos-title">
          <h2 id="turnos-title" className="text-xl font-bold mb-6 text-brand-dark">Farmacias de Turno Hoy</h2>
          {state.loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-5 bg-white border border-brand-background rounded-2xl shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-6" />
                  <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : state.turnos.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {state.turnos.map((f, i) => <FarmaciaCard key={i} farmacia={f} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-brand-background bg-brand-background/40 p-6 space-y-4">
              <p className="font-medium text-brand-dark">
                No hay farmacia de turno hoy en <strong>{comuna.nombre}</strong>, busca en las comunas cercanas de la <strong>{region.nombre}</strong>
              </p>
              <p className="text-sm text-brand-muted leading-relaxed">
                Puede que el turno esté asignado a otra comuna cercana o que no se haya publicado un local para esta fecha. Revisa otras comunas de {region.nombre} para encontrar farmacias de turno cercanas.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={`/regiones/${region.slug}`} className="bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-medium">
                  Comunas cercanas
                </Link>
                <a href="#locales-comunes" className="bg-white border border-brand-dark text-brand-dark px-5 py-2.5 rounded-xl text-sm font-medium">
                  Más farmacias en {comuna.nombre}
                </a>
              </div>
            </div>
          )}
        </section>

        {/* SECCIÓN OTRAS FARMACIAS */}
        <section id="locales-comunes" aria-labelledby="comunes-title">
          <h2 id="comunes-title" className="text-xl font-bold mb-6 text-brand-dark">Otras Farmacias en {comuna.nombre}</h2>
          {state.loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-5 bg-white border border-brand-background rounded-2xl shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                </div>
              ))}
            </div>
          ) : state.comunes.length === 0 ? (
            <div className="rounded-xl border border-brand-background bg-brand-background/40 p-6">
              <p className="font-medium text-brand-dark">No encontramos otras farmacias registradas en {comuna.nombre}.</p>
            </div>
          ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.comunes.map((f, i) => {
              const phone = cleanPhone(f.local_telefono);
              const openStatus = isOpenNow(f.funcionamiento_hora_apertura, f.funcionamiento_hora_cierre);
              const hasSchedule = !!f.funcionamiento_hora_apertura && !!f.funcionamiento_hora_cierre;

              return (
                <div key={i} className="p-5 bg-white border border-brand-background rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-brand-dark capitalize text-sm mb-1">{f.local_nombre?.toLowerCase()}</h3>
                    <p className="text-xs text-brand-muted capitalize mb-4">{f.local_direccion?.toLowerCase()}</p>
                    
                    {phone && (
                      <a href={`tel:${phone}`} className="text-xs text-brand-dark font-medium flex items-center gap-2 mb-3 bg-brand-background p-2 rounded-lg w-fit">
                        📞 {phone}
                      </a>
                    )}
                    
                    {hasSchedule && (
                      <div className="flex items-center gap-2 text-[11px] font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full ${openStatus === true ? "bg-green-500" : openStatus === false ? "bg-red-500" : "bg-gray-300"}`} />
                        <span className={openStatus === true ? "text-green-600" : openStatus === false ? "text-red-500" : "text-gray-500"}>
                          {openStatus === true ? "Abierto ahora" : openStatus === false ? "Cerrado ahora" : ""}
                        </span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-500">{formatTime(f.funcionamiento_hora_apertura)} - {formatTime(f.funcionamiento_hora_cierre)} hrs</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-50">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${f.local_lat},${f.local_lng}`} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-brand-dark tracking-wider hover:underline">
                      VER EN MAPA →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </section>

        {/* FAQ */}
        <section className="border-t border-brand-background pt-10" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-xl md:text-2xl font-bold text-brand-dark mb-2">
            Preguntas frecuentes sobre farmacias de turno en {comuna.nombre}
          </h2>
          <div className="divide-y border border-brand-background rounded-2xl overflow-hidden mt-6">
            {faqItems.map((item, idx) => (
              <details key={idx} className="group bg-white">
                <summary className="flex items-center justify-between gap-4 cursor-pointer px-5 py-4 font-medium text-brand-dark list-none">
                  {item.q}
                  <span className="text-brand-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-brand-muted leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </section>

        <div className="pt-4 pb-10">
          <Link to={`/regiones/${region.slug}`} className="inline-flex items-center gap-2 text-sm text-brand-dark font-medium hover:underline">
            Volver a {region.nombre}
          </Link>
        </div>
      </div>
    </>
  );
}
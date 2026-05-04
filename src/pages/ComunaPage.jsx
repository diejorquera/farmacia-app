// src/pages/ComunaPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLoaderData } from "react-router";
import { slugToRegion } from "../utils/catalogo.js";
import { COMUNAS_CHILE } from "../data/comunas";
import {
  getTurnosPorRegion,
  getTodosLosLocalesPorRegion,
} from "../services/farmacias";
import { FarmaciaCard } from "../components/FarmaciaCard";
import { slugify } from "../utils/slugify";

const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";
const PREFIX = "farmacia-turno-";

// ─── Utilidades ───────────────────────────────────────────────────────────────

const formatTime = (t) => t?.slice(0, 5) || "";

const cleanPhone = (raw) => {
  if (!raw) return null;
  let digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("56")) digits = digits.slice(2);
  digits = digits.replace(/^0+/, "");
  if (digits.length < 8 || digits.length > 9) return null;
  return `+56${digits}`;
};

/**
 * Determina si una farmacia está abierta ahora.
 * Retorna: true (abierta) | false (cerrada) | null (sin info)
 */
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

/**
 * Enriquece cada farmacia con su estado de apertura calculado una sola vez,
 * luego ordena: abiertas → sin info → cerradas.
 */
const enrichAndSort = (farmacias) => {
  const enriched = farmacias.map((f) => ({
    ...f,
    _openStatus: isOpenNow(
      f.funcionamiento_hora_apertura,
      f.funcionamiento_hora_cierre
    ),
  }));

  const order = (f) => {
    if (f._openStatus === true) return 0;
    if (f._openStatus === null) return 1;
    return 2; // false → cerrada
  };

  return enriched.sort((a, b) => order(a) - order(b));
};

// ─── LOADER ───────────────────────────────────────────────────────────────────
export async function loader({ params }) {
  const region = slugToRegion[params.regionSlug] ?? null;
  const comunaSlug = params.comunaToken?.startsWith(PREFIX)
    ? params.comunaToken.slice(PREFIX.length)
    : null;

  const comuna =
    region && comunaSlug
      ? (COMUNAS_CHILE.find(
          (c) =>
            c.region_id === Number(region.id_api) &&
            slugify(c.nombre) === comunaSlug
        ) ?? null)
      : null;

  const comunasDeRegion = region
    ? COMUNAS_CHILE.filter((c) => c.region_id === Number(region.id_api))
        .slice()
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    : [];

  return { region, comuna, comunaSlug, comunasDeRegion };
}

// ─── META (SEO) ───────────────────────────────────────────────────────────────
export function meta({ data }) {
  if (!data?.region || !data?.comuna) {
    return [{ title: "Farmacia de Turno | FarmaciasHoy.cl" }];
  }

  const { region, comuna } = data;
  const comunaNombre = comuna.nombre;
  const regionNombre = region.nombre;
  const canonicalUrl = `${CANONICAL_ORIGIN}/regiones/${region.slug}/${PREFIX}${slugify(comunaNombre)}`;

  const title = `Farmacia de Turno – ${comunaNombre} Hoy`;
  const description = `Farmacia de turno en ${comunaNombre} hoy. Direcciones, teléfonos y horarios actualizados de locales abiertos en la ${regionNombre}. Datos oficiales MINSAL.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: title,
    description: description,
    url: canonicalUrl,
    lastReviewed: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: CANONICAL_ORIGIN },
        { "@type": "ListItem", position: 2, name: regionNombre, item: `${CANONICAL_ORIGIN}/regiones/${region.slug}` },
        { "@type": "ListItem", position: 3, name: comunaNombre, item: canonicalUrl },
      ],
    },
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

// ─── Subcomponente: card de local (no turno) ─────────────────────────────────

function LocalFarmaciaCard({ farmacia }) {
  const f = farmacia;
  const phone = cleanPhone(f.local_telefono);
  const openStatus = f._openStatus; // ya calculado en enrichAndSort
  const hasSchedule =
    !!f.funcionamiento_hora_apertura && !!f.funcionamiento_hora_cierre;

  const statusConfig = {
    true:  { label: "Abierto", cls: "bg-green-100 text-green-700 border border-green-200" },
    false: { label: "Cerrado", cls: "bg-red-50 text-red-600 border border-red-100" },
    null:  { label: "S/I",     cls: "bg-gray-100 text-gray-500 border border-gray-200" },
  };
  const status = statusConfig[String(openStatus)] ?? statusConfig["null"];

  return (
    <div className="relative p-5 bg-white border border-brand-background rounded-2xl shadow-sm flex flex-col justify-between transition-hover hover:border-brand-dark/20">

      {/* Badge estado */}
      {hasSchedule && (
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight ${status.cls}`}>
            {status.label}
          </span>
        </div>
      )}

      {/* Contenido */}
      <div className="pr-14">
        <h3 className="font-bold text-brand-dark capitalize text-sm mb-1 leading-tight">
          {f.local_nombre?.toLowerCase()}
        </h3>
        <p className="text-xs text-brand-muted capitalize mb-4 leading-normal">
          {f.local_direccion?.toLowerCase()}
        </p>

        {phone && (
          <a
            href={`tel:${phone}`}
            className="text-xs text-brand-dark font-semibold flex items-center gap-2 mb-3 bg-brand-background/50 hover:bg-brand-background p-2 rounded-lg w-fit transition-colors"
          >
            <span>📞</span> {phone}
          </a>
        )}

        {hasSchedule && (
          <div className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50/50 p-1.5 rounded-md w-fit">
            <span className="font-bold text-brand-dark">Horario:</span>
            <span>
              {formatTime(f.funcionamiento_hora_apertura)} –{" "}
              {formatTime(f.funcionamiento_hora_cierre)} hrs
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-50">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${f.local_lat},${f.local_lng}`}
          target="_blank"
          rel="noopener noreferrer"
          title={`Ver ubicación de ${f.local_nombre?.toLowerCase()} en el mapa`}
          className="text-[11px] font-bold text-brand-dark tracking-widest hover:underline flex items-center gap-1"
        >
          Ver en mapa <span className="text-xs">→</span>
        </a>
      </div>
    </div>
  );
}

// ─── Subcomponente: divisor entre grupos ─────────────────────────────────────

function GroupDivider({ label }) {
  return (
    <div className="col-span-full flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-brand-background" />
      <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-brand-background" />
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────

export default function ComunaPage() {
  const { region, comuna, comunasDeRegion } = useLoaderData();
  const [state, setState] = useState({
    loading: true,
    error: null,
    turnos: [],
    comunes: [],
  });

  const otrasComunasNombres = useMemo(() => {
    if (!comuna) return comunasDeRegion.map((c) => c.nombre);
    return comunasDeRegion
      .filter((c) => c.id !== comuna.id)
      .map((c) => c.nombre);
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
          getTodosLosLocalesPorRegion(region.id_api),
        ]);

        if (!alive) return;

        const turnos = rawTurnos.filter(
          (f) => slugify(f.comuna_nombre || f.comuna || "") === targetSlug
        );

        const idsTurno = new Set(
          turnos.map((t) => t.local_id || t.id_local || t.local_direccion)
        );
        const comunesRaw = rawTodos.filter(
          (f) =>
            slugify(f.comuna_nombre || f.comuna || "") === targetSlug &&
            !idsTurno.has(f.local_id || f.id_local || f.local_direccion)
        );

        // Enriquecer con estado de apertura y ordenar abiertas primero
        const comunes = enrichAndSort(comunesRaw);

        setState({ loading: false, error: null, turnos, comunes });
      } catch {
        if (alive)
          setState({ loading: false, error: "Error", turnos: [], comunes: [] });
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
      otrasComunas: otrasComunasNombres,
    });
  }, [region, comuna, otrasComunasNombres]);

  // Contadores para los divisores
  const countOpen = useMemo(
    () => state.comunes.filter((f) => f._openStatus === true).length,
    [state.comunes]
  );
  const countNoInfo = useMemo(
    () => state.comunes.filter((f) => f._openStatus === null).length,
    [state.comunes]
  );
  const countClosed = useMemo(
    () => state.comunes.filter((f) => f._openStatus === false).length,
    [state.comunes]
  );

  if (!region || !comuna)
    return <div className="p-10 text-center">Cargando información...</div>;

  return (
    <>
      {/* Hero */}
      <div className="min-h-[220px] bg-[url('/img/regionessm.webp')] md:bg-[url('/img/regionesmd.webp')] 2xl:bg-[url('/img/regioneslg.webp')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center py-8 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl lg:text-5xl font-bold mb-3">
            Farmacia de Turno – {comuna.nombre} Hoy
          </h1>
          <nav className="text-sm opacity-80" aria-label="Breadcrumb">
            <Link to="/" className="hover:underline">Inicio</Link>{" "}›{" "}
            <Link to="/regiones" className="hover:underline">Regiones</Link>{" "}›{" "}
            <Link to={`/regiones/${region.slug}`} className="hover:underline">
              {region.nombre}
            </Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">

        {/* ── SECCIÓN TURNOS ── */}
        <section aria-labelledby="turnos-title">
          <h2 id="turnos-title" className="text-xl font-bold mb-6 text-brand-dark">
            Farmacias de Turno Hoy
          </h2>

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
              {state.turnos.map((f, i) => (
                <FarmaciaCard key={f.local_id ?? f.id_local ?? i} farmacia={f} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-brand-background bg-brand-background/40 p-6 space-y-4">
              <p className="font-medium text-brand-dark">
                No hay farmacia de turno hoy en <strong>{comuna.nombre}</strong>,
                busca en las comunas cercanas de la <strong>{region.nombre}</strong>
              </p>
              <p className="text-sm text-brand-muted leading-relaxed">
                Puede que el turno esté asignado a otra comuna cercana o que no se haya
                publicado un local para esta fecha. Revisa otras comunas de{" "}
                {region.nombre} para encontrar farmacias de turno cercanas.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/regiones/${region.slug}`}
                  className="bg-brand-dark text-white px-5 py-2.5 rounded-xl text-sm font-medium"
                >
                  Comunas cercanas
                </Link>
                <a
                  href="#locales-comunes"
                  className="bg-white border border-brand-dark text-brand-dark px-5 py-2.5 rounded-xl text-sm font-medium"
                >
                  Más farmacias en {comuna.nombre}
                </a>
              </div>
            </div>
          )}
        </section>

        {/* ── SECCIÓN OTRAS FARMACIAS ── */}
        <section id="locales-comunes" aria-labelledby="comunes-title">
          <h2 id="comunes-title" className="text-xl font-bold mb-3 text-brand-dark">
            Otras Farmacias en {comuna.nombre}
          </h2>

          <p className="text-sm text-brand-muted mb-6 leading-relaxed max-w-4xl">
            Si necesitas encontrar una <strong>farmacia cerca de tu ubicación</strong>,
            revisa este directorio completo con todas las opciones disponibles en{" "}
            {comuna.nombre}. Encuentra la <strong>farmacia más cerca</strong> comparando
            horarios de atención, direcciones y teléfonos. Ya sea que busques el local
            habitual de tu barrio o necesites ubicar{" "}
            <strong>farmacias 24 horas</strong>, aquí puedes ver si se encuentran
            abiertas en este momento.
          </p>

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
              <p className="font-medium text-brand-dark">
                No encontramos otras farmacias registradas en {comuna.nombre}.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Grupo: Abiertas */}
              {countOpen > 0 && (
                <GroupDivider label={`Abiertas ahora · ${countOpen}`} />
              )}
              {state.comunes
                .filter((f) => f._openStatus === true)
                .map((f) => (
                  <LocalFarmaciaCard
                    key={f.local_id ?? f.id_local ?? f.local_direccion}
                    farmacia={f}
                  />
                ))}

              {/* Grupo: Sin info de horario */}
              {countNoInfo > 0 && (
                <GroupDivider label={`Sin horario registrado · ${countNoInfo}`} />
              )}
              {state.comunes
                .filter((f) => f._openStatus === null)
                .map((f) => (
                  <LocalFarmaciaCard
                    key={f.local_id ?? f.id_local ?? f.local_direccion}
                    farmacia={f}
                  />
                ))}

              {/* Grupo: Cerradas */}
              {countClosed > 0 && (
                <GroupDivider label={`Cerradas · ${countClosed}`} />
              )}
              {state.comunes
                .filter((f) => f._openStatus === false)
                .map((f) => (
                  <LocalFarmaciaCard
                    key={f.local_id ?? f.id_local ?? f.local_direccion}
                    farmacia={f}
                  />
                ))}

            </div>
          )}
        </section>

        {/* ── FAQ ── */}
        <section
          className="border-t border-brand-background pt-10"
          aria-labelledby="faq-title"
        >
          <h2
            id="faq-title"
            className="text-xl md:text-2xl font-bold text-brand-dark mb-2"
          >
            Preguntas frecuentes sobre farmacias de turno en {comuna.nombre}
          </h2>
          <div className="divide-y border border-brand-background rounded-2xl overflow-hidden mt-6">
            {faqItems.map((item, idx) => (
              <details key={idx} className="group bg-white">
                <summary className="flex items-center justify-between gap-4 cursor-pointer px-5 py-4 font-medium text-brand-dark list-none">
                  {item.q}
                  <span className="text-brand-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-brand-muted leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className="pt-4 pb-10">
          <Link
            to={`/regiones/${region.slug}`}
            className="inline-flex items-center gap-2 text-sm text-brand-dark font-medium hover:underline"
          >
            Volver a {region.nombre}
          </Link>
        </div>
      </div>
    </>
  );
}

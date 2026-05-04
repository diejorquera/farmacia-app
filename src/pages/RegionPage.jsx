// src/pages/RegionPage.jsx
import { Fragment, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import { useLoaderData } from "react-router";
import { Listbox, Transition } from "@headlessui/react";
import { slugToRegion, comunasPorRegion } from "../utils/catalogo";
import { getTurnosPorRegion, getComunasPorRegion } from "../services/farmacias";
import { FarmaciaCard } from "../components/FarmaciaCard";
import Spinner from "../components/Spinner";
import { track } from "../lib/analytics";
import ListaComunas from "../components/ListaComunas";

const SELECT_PLACEHOLDER = "__seleccionar__";
const ALL_VALUE = "__todas__";
const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";

// ─── LOADER ───────────────────────────────────────────────────────────────────
export async function loader({ params }) {
  const region = slugToRegion[params.slug] ?? null;

  const comunasDeRegion = region
    ? (comunasPorRegion?.[Number(region.id_api)] || [])
        .map((c) => (typeof c === "string" ? { nombre: c } : c))
        .filter(Boolean)
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    : [];

  return { region, comunasDeRegion };
}

// ─── META ─────────────────────────────────────────────────────────────────────
export function meta({ data }) {
  if (!data?.region) return [];

  const { region, comunasDeRegion } = data;
  const url = `${CANONICAL_ORIGIN}/regiones/${region.slug}`;
  const title = `Farmacias de turno en ${region.nombre} | Comunas y Horarios – FarmaciasHoy`;
  const description = `Encuentra farmacias de turno en ${region.nombre} hoy. Filtra por comuna y consulta dirección, teléfono y horario actualizado. Datos oficiales del MINSAL.`;

  const schema = {
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
        { "@type": "ListItem", position: 3, name: region.nombre, item: url },
      ],
    },
  };

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { "script:ld+json": schema },
  ];
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function buildFaqItems({ regionNombre, comunas }) {
  const ejemplos = (comunas || []).slice(0, 3).map((c) => c.nombre).join(", ");
  const ejemplo1 = comunas?.[0]?.nombre;
  const ejemplo2 = comunas?.[1]?.nombre;

  return [
    {
      q: "¿Dónde puedo encontrar la farmacia de turno más cercana a mi ubicación?",
      a: `Puedes encontrar la farmacia de turno más cercana revisando el listado actualizado de ${regionNombre}. En esta página puedes filtrar por comuna y ver dirección, horario y teléfono informados oficialmente.`,
    },
    {
      q: "¿Cuáles son las farmacias de turno abiertas hoy en mi ciudad?",
      a: `Las farmacias de turno cambian diariamente. Para ${regionNombre}, revisa el listado del día por comuna${ejemplos ? ` (por ejemplo: ${ejemplos})` : ""} y confirma los horarios publicados para cada local.`,
    },
    {
      q: "¿Hay alguna aplicación móvil para localizar farmacias de turno en Chile?",
      a: `Puedes usar buscadores y mapas, pero también sitios especializados. En FarmaciasHoy puedes revisar las farmacias de turno por región (${regionNombre}) y filtrar por comuna para encontrar alternativas cercanas.`,
    },
    {
      q: "¿Puedo comprar medicamentos de farmacia de turno en línea con entrega a domicilio?",
      a: `Depende de cada farmacia. Que una farmacia esté de turno no significa que tenga delivery. Si aparece teléfono en el listado, lo mejor es contactar directamente al local para confirmar despacho y stock.`,
    },
    {
      q: "¿Qué servicios ofrecen las farmacias de turno en emergencias médicas?",
      a: `Las farmacias de turno ayudan a acceder a medicamentos fuera del horario habitual, pero no reemplazan un servicio de urgencia. En emergencias médicas, lo correcto es acudir a un centro asistencial.`,
    },
    {
      q: "¿Existen cadenas de farmacias que tengan farmacias de turno garantizadas 24/7?",
      a: `En algunas comunas puede haber turnos con horarios extendidos, pero no es una garantía universal. Revisa siempre el horario de apertura/cierre publicado para cada local en ${regionNombre}.`,
    },
    {
      q: "¿Cómo puedo consultar el listado actualizado de farmacias de turno en mi comuna?",
      a: `Selecciona tu comuna en el filtro y verás los resultados del día. También puedes elegir "Todas" para ver el listado completo en ${regionNombre}.${ejemplo1 && ejemplo2 ? ` Ejemplos de comunas: ${ejemplo1} y ${ejemplo2}.` : ""}`,
    },
    {
      q: "¿Dónde puedo ver reseñas y valoraciones de farmacias de turno en Chile?",
      a: `Las reseñas suelen estar en servicios de mapas y directorios. Aquí puedes ver la información de turno del día (dirección, horario y teléfono) y luego complementar con reseñas externas si lo necesitas.`,
    },
    {
      q: "¿Las farmacias de turno ofrecen descuentos o promociones especiales en productos?",
      a: `No necesariamente. Las promociones dependen de cada farmacia y cadena, y no del turno. Si necesitas un producto específico, conviene llamar antes para confirmar precio y disponibilidad.`,
    },
    {
      q: "¿Puedo reservar medicamentos por teléfono en una farmacia de turno?",
      a: `Depende de la política del local. Si el listado incluye teléfono, puedes llamar para consultar stock y preguntar si realizan reserva, especialmente para medicamentos de alta demanda.`,
    },
  ];
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
export default function RegionPage() {
  const { region, comunasDeRegion } = useLoaderData();
  const { slug } = useParams();

  const [state, setState] = useState({ loading: false, error: null, items: [] });
  const [comunas, setComunas] = useState([]);
  const [comunasLoaded, setComunasLoaded] = useState(false);
  const [loadingComunas, setLoadingComunas] = useState(false);
  const [comuna, setComuna] = useState(SELECT_PLACEHOLDER);

  const comunasForSeo = useMemo(() => {
    const fromApi = Array.isArray(comunas) && comunas.length ? comunas : [];
    const list = fromApi.length ? fromApi : comunasDeRegion;
    return list
      .map((c) => (typeof c === "string" ? { nombre: c } : c))
      .filter(Boolean)
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }, [comunas, comunasDeRegion]);

  const comunasTextoSeo = useMemo(() => {
    const names = comunasForSeo.map((c) => c.nombre);
    if (!names.length) return "";
    const top = names.slice(0, 10);
    const rest = names.length - top.length;
    return rest > 0 ? `${top.join(", ")} y otras comunas.` : `${top.join(", ")}.`;
  }, [comunasForSeo]);

  const faqItems = useMemo(() => {
    if (!region) return [];
    return buildFaqItems({ regionNombre: region.nombre, comunas: comunasForSeo });
  }, [region, comunasForSeo]);

  // Reset al cambiar región
  useEffect(() => {
    setComuna(SELECT_PLACEHOLDER);
    setState({ loading: false, error: null, items: [] });
    setComunas([]);
    setComunasLoaded(false);
    setLoadingComunas(false);
  }, [region?.id_api]);

  // FAQ JSON-LD
  useEffect(() => {
    if (!region || !faqItems.length) return;
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
  }, [region, faqItems]);

  // Carga perezosa de comunas para el Listbox
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

  // GA: selección de comuna
  useEffect(() => {
    if (!region || comuna === SELECT_PLACEHOLDER) return;
    track("seleccionar_comuna", {
      region_slug: region.slug,
      region_nombre: region.nombre,
      comuna: comuna === ALL_VALUE ? "(todas)" : comuna,
    });
  }, [region, comuna]);

  // Cargar turnos
  useEffect(() => {
    let alive = true;
    async function loadTurnos() {
      if (!region) return;
      if (comuna === SELECT_PLACEHOLDER) {
        if (alive) setState({ loading: false, error: null, items: [] });
        return;
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
        if (alive) {
          track("listar_farmacias", {
            region_slug: region.slug,
            region_nombre: region.nombre,
            comuna: comuna === ALL_VALUE ? "(todas)" : comuna,
            resultados: items.length,
          });
        }
      } catch {
        if (alive) setState({ loading: false, error: "No se pudo cargar la información", items: [] });
      }
    }
    loadTurnos();
    return () => { alive = false; };
  }, [region, comuna]);

  if (!region) {
    return (
      <div className="container mx-auto px-4 py-8" id="contenido-principal">
        <p className="mb-4">Región no encontrada.</p>
        <p><Link to="/regiones" className="underline">Volver al listado</Link></p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[202px] md:min-h-[300px] 2xl:min-h-[400px] bg-[url('/img/regionessm.webp')] md:bg-[url('/img/regionesmd.webp')] 2xl:bg-[url('/img/regioneslg.webp')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center py-3 md:py-5">
        <div className="container mx-auto px-4 py-8 space-y-6" id="contenido-principal">
          <nav className="text-sm text-brand-background" aria-label="Ruta de navegación">
            <ol className="flex items-center gap-2 list-none p-0 m-0">
              <li><Link to="/" className="hover:underline text-brand-background">Inicio</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link to="/regiones" className="hover:underline text-brand-background">Regiones</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="font-bold text-white">{region.nombre}</li>
            </ol>
          </nav>

          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl lg:text-5xl font-bold mb-4 text-brand-background">
              Farmacias de turno en {region.nombre}
            </h1>
            <p id="descripcion-pagina" className="text-brand-background/90 text-sm md:text-base">
              Elige una comuna para ver las farmacias abiertas ahora, con dirección y teléfono.
            </p>
          </div>

          
          <ListaComunas regionId={region.id_api} regionSlug={region.slug} />

          {!!comunasTextoSeo && (
            <section className="max-w-4xl text-sm text-brand-background/90 leading-relaxed">
              <p>
                En <strong>{region.nombre}</strong> puedes encontrar farmacias de turno hoy en comunas como{" "}
                <strong>{comunasTextoSeo}</strong>
              </p>
            </section>
          )}
        </div>
      </div>

      <section className="w-full bg-white">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div aria-live="polite" className="min-h-5">
            {!state.loading && !state.error && comuna !== SELECT_PLACEHOLDER && (
              <p id="conteo-resultados" className="text-sm font-medium text-brand-muted">
                {state.items.length > 0
                  ? `${state.items.length} farmacia${state.items.length !== 1 ? "s" : ""} de turno hoy${comuna !== ALL_VALUE ? ` en ${comuna}` : ` en ${region.nombre}`}`
                  : `Sin farmacias de turno${comuna !== ALL_VALUE ? ` en ${comuna}` : ""} por el momento`}
              </p>
            )}
          </div>

          {state.loading && (
            <div className="grid gap-4 md:grid-cols-2" role="status" aria-busy="true" aria-live="polite" aria-label="Cargando farmacias">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-brand-background rounded-xl p-4 bg-white animate-pulse">
                  <div className="h-5 w-1/2 bg-brand-muted/20 rounded mb-3" />
                  <div className="h-4 w-3/4 bg-brand-muted/20 rounded mb-2" />
                  <div className="h-4 w-1/3 bg-brand-muted/20 rounded" />
                  <div className="h-24 w-full bg-brand-muted/20 rounded mt-4" />
                </div>
              ))}
            </div>
          )}

          {state.error && <p className="text-red-600" role="alert">{state.error}</p>}

          {!state.loading && !state.error && comuna !== SELECT_PLACEHOLDER && (
            state.items.length ? (
              <div aria-labelledby="titulo-resultados">
                <h2 id="titulo-resultados" className="sr-only">Resultados</h2>
                <ul id="lista-resultados" role="list" className="grid gap-2 md:grid-cols-2">
                  {state.items.map((farmacia) => (
                    <li
                      key={farmacia.local_id || farmacia.id_local || `${farmacia.local_nombre}|${farmacia.local_direccion}`}
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

          <section aria-labelledby="faq-title" className="border-t border-brand-background pt-8">
            <h2 id="faq-title" className="text-xl md:text-2xl font-bold text-brand-dark">
              Preguntas frecuentes sobre farmacias de turno en {region.nombre}
            </h2>
            <p className="mt-2 text-sm text-brand-muted leading-relaxed">
              Todo lo que necesitas saber antes de salir a buscar medicamentos. Incluye comunas de {region.nombre} como{" "}
              {comunasForSeo.slice(0, 3).map((c) => c.nombre).join(", ")}.
            </p>
            <div className="mt-6 rounded-xl border border-brand-background overflow-hidden divide-y divide-brand-background">
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
        </div>
      </section>
    </>
  );
}
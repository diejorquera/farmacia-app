// Piezas compartidas por todos los banners de webs4all.cl en farmaciashoy.cl.
// Cada banner es una capa fina sobre <BannerCard> (formato tarjeta) o <BannerBarra> (320x50).

import { buildHref } from "./buildHref";

// `resalte` colorea lo que va dentro de <strong>: así lo importante se nota
// aunque el titular ya sea negrita (la negrita sola no se distingue ahí).
const TEMAS = {
  oscuro: {
    caja: "bg-brand-dark text-white border-l-8 border-emerald-400",
    bajada: "text-white/90",
    boton: "bg-emerald-400 text-brand-dark hover:bg-emerald-300",
    tachado: "text-white/60",
    etiqueta: "bg-emerald-400 text-brand-dark",
    resalte: "[&_strong]:text-emerald-300 [&_strong]:font-extrabold",
  },
  claro: {
    caja: "bg-white text-brand-dark border-2 border-brand-dark border-l-8",
    bajada: "text-brand-dark/80",
    boton: "bg-brand-dark text-white hover:bg-brand-dark/90",
    tachado: "text-brand-muted",
    etiqueta: "bg-brand-dark text-white",
    resalte: "[&_strong]:text-emerald-700 [&_strong]:font-extrabold",
  },
  verde: {
    caja: "bg-emerald-700 text-white border-l-8 border-yellow-300",
    bajada: "text-white/95",
    boton: "bg-yellow-300 text-brand-dark hover:bg-yellow-200",
    tachado: "text-white/70",
    etiqueta: "bg-yellow-300 text-brand-dark",
    resalte: "[&_strong]:text-yellow-300 [&_strong]:font-extrabold",
  },
  // Para ofertas: amarillo, el color que más llama la atención en esta página.
  oferta: {
    caja: "bg-amber-300 text-brand-dark border-l-8 border-brand-dark",
    bajada: "text-brand-dark/90",
    boton: "bg-brand-dark text-white hover:bg-brand-dark/90",
    tachado: "text-brand-dark/60",
    etiqueta: "bg-brand-dark text-amber-300",
    resalte: "[&_strong]:text-red-700 [&_strong]:font-extrabold",
  },
};

/**
 * Banner en formato tarjeta (responsive: apilado en móvil, horizontal desde sm).
 * Un solo botón, un solo enlace.
 */
export function BannerCard({
  campaign,
  titulo,
  bajada,
  boton,
  precioAntes, // opcional: se muestra tachado sobre el titular
  etiqueta, // opcional: texto pequeño sobre el titular (ej. "Black Friday")
  tema = "oscuro",
  className = "",
}) {
  const t = TEMAS[tema] ?? TEMAS.oscuro;

  return (
    <aside
      aria-label="Publicidad de webs4all.cl"
      className={`font-montserrat rounded-xl shadow-lg p-5 sm:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 ${t.caja} ${className}`}
    >
      <div className={`flex-1 min-w-0 ${t.resalte}`}>
        {etiqueta && (
          <p
            className={`inline-block text-xs font-extrabold uppercase tracking-wider rounded px-2 py-1 mb-2 ${t.etiqueta}`}
          >
            {etiqueta}
          </p>
        )}
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-balance">
          {precioAntes && (
            <span className={`line-through font-medium mr-3 ${t.tachado}`}>
              {precioAntes}
            </span>
          )}
          {titulo}
        </p>
        <p className={`mt-2 text-sm sm:text-base lg:text-lg leading-snug ${t.bajada}`}>{bajada}</p>
      </div>

      <a
        href={buildHref(campaign)}
        target="_blank"
        rel="noopener"
        className={`shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg px-7 py-4 text-base font-extrabold shadow-md transition-colors text-center ${t.boton}`}
      >
        {boton}
        <span aria-hidden="true">→</span>
      </a>
    </aside>
  );
}

/**
 * Barra ultracorta para móvil (320x50). Pensada para sticky inferior.
 * Toda la barra es el enlace; no lleva botón aparte.
 */
export function BannerBarra({ campaign, texto, className = "" }) {
  return (
    <a
      href={buildHref(campaign)}
      target="_blank"
      rel="noopener"
      aria-label={`${texto} — webs4all.cl`}
      className={`font-montserrat flex items-center justify-between gap-2 w-full max-w-[320px] h-[50px] px-3 rounded-lg bg-brand-dark text-white text-[13px] font-semibold leading-tight overflow-hidden ${className}`}
    >
      <span className="line-clamp-2">{texto}</span>
      <span
        aria-hidden="true"
        className="shrink-0 rounded-md bg-emerald-500 text-brand-dark text-xs font-bold px-2 py-1"
      >
        webs4all.cl
      </span>
    </a>
  );
}

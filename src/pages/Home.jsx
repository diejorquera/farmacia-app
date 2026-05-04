// src/pages/Home.jsx
import { FarmaciaBuscadorLocal } from "../components/FarmaciaBuscadorLocal.jsx";
import { RegionesGrid } from "../components/RegionesGrid.jsx";
import { FAQSection } from "../components/FaqSection.jsx";

const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";

// ─── META ─────────────────────────────────────────────────────────────────────
export function meta() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FarmaciasHoy.cl - Farmacias de turno en Chile",
    url: CANONICAL_ORIGIN,
    description: "Encuentra la farmacia de turno más cercana en Chile. Horarios actualizados, teléfonos y direcciones por región y comuna. Datos oficiales del MINSAL.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${CANONICAL_ORIGIN}/regiones/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return [
    { title: "Farmacias de Turno Hoy en Chile | Horarios, Teléfonos y Direcciones" },
    { name: "description", content: "Encuentra la farmacia de turno más cercana en Chile. Horarios actualizados, teléfonos y direcciones por región y comuna. Datos oficiales del MINSAL. ¡Consulta gratis!" },
    { tagName: "link", rel: "canonical", href: CANONICAL_ORIGIN },
    { "script:ld+json": schema },
  ];
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen antialiased font-montserrat">

      {/* ── Hero ── */}
      <section className="min-h-[300px] md:min-h-[337px] 2xl:min-h-[432px] bg-[url('/img/herosm.webp')] md:bg-[url('/img/heromd.webp')] 2xl:bg-[url('/img/herolg.webp')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center">
        <div className="max-w-5xl w-full flex flex-col md:gap-8 gap-3 px-4 md:px-0">
          <h1 className="text-2xl lg:text-5xl font-bold text-brand-background text-center">
            Farmacias de turno en Chile: encuentra la farmacia abierta hoy en tu
            comuna
          </h1>
          <FarmaciaBuscadorLocal />
        </div>
      </section>

      {/* ── Contenido principal ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        <div className="py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
          <RegionesGrid />
          <FAQSection />
        </div>
      </div>

    </div>
  );
}
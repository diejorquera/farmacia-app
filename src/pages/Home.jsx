// src/pages/Home.jsx
import { FarmaciaBuscador } from "../components/FarmaciaBuscador.jsx";
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
      <FarmaciaBuscador />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        <div className="py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
          <RegionesGrid />
          <FAQSection />
        </div>
      </div>
    </div>
  );
}
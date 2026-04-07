// src/pages/Regiones.jsx
import { Link } from "react-router";
import { RegionesGrid } from "../components/RegionesGrid";

const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";

// ─── META ─────────────────────────────────────────────────────────────────────
export function meta() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Farmacias de Turno por Región | FarmaciasHoy.cl",
    url: `${CANONICAL_ORIGIN}/regiones`,
    description: "Encuentra farmacias de turno hoy en todas las regiones de Chile. Selecciona tu región y filtra por comuna.",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: CANONICAL_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Regiones", item: `${CANONICAL_ORIGIN}/regiones` },
      ],
    },
  };

  return [
    { title: "Farmacias de Turno por Región | FarmaciasHoy.cl" },
    { name: "description", content: "Encuentra farmacias de turno hoy en todas las regiones de Chile. Selecciona tu región y filtra por comuna." },
    { tagName: "link", rel: "canonical", href: `${CANONICAL_ORIGIN}/regiones` },
    { "script:ld+json": JSON.stringify(schema) },
  ];
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
export default function Regiones() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <nav className="text-sm text-gray-600">
        <Link to="/" className="hover:underline">Inicio</Link>{" "}
        <span>›</span> <span className="font-semibold">Regiones</span>
      </nav>
      <RegionesGrid />
    </main>
  );
}
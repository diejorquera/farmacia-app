import { useEffect } from "react";
import { Link } from "react-router-dom";
import { RegionesGrid } from "../components/RegionesGrid";

export default function Regiones() {
  useEffect(() => {
    document.title = "Farmacias de Turno por Región | Farmacias-de-turno.cl";
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600">
        <Link to="/" className="hover:underline">
          Inicio
        </Link>{" "}
        <span>›</span> <span className="font-semibold">Regiones</span>
      </nav>

      {/* Grid de regiones */}
      <RegionesGrid />
    </main>
  );
}

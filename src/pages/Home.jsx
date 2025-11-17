// src/pages/Home.jsx
import { useEffect } from "react";
import { FarmaciaBuscador } from "../components/FarmaciaBuscador.jsx";
import { RegionesGrid } from "../components/RegionesGrid.jsx";

export default function Home() {
  // Título correcto para GA + navegador
  useEffect(() => {
    document.title = "Farmacias de turno en Chile";
  }, []);

  return (
    <div className="min-h-screen antialiased font-montserrat">
      <FarmaciaBuscador />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        <div className="py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
          <RegionesGrid />
        </div>
      </div>
    </div>
  );
}

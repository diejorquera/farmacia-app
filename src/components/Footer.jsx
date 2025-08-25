// Footer.jsx
import { Link } from "react-router-dom";
import logo from "../assets/farmacia-de-turno-horizontal.svg";
import { REGIONES } from "../data/regiones.js"; // tu archivo de data

// Clasificación por grupos (puedes ajustarlo según tu criterio)
const REGIONES_NORTE = [1, 2, 3, 4, 5];       // ids: Arica → Coquimbo
const REGIONES_CENTRO = [6, 7, 8, 9,16];         // Valparaíso → Maule
const REGIONES_SUR = [10, 11, 12, 13, 14, 15]; // Biobío → Magallanes
        

export default function Footer() {
  const renderLinks = (ids) =>
    REGIONES.filter(r => ids.includes(r.id_api)).map((region) => (
      <li key={region.slug}>
        <Link
          to={`/regiones/${region.slug}`}
          className="hover:text-white"
        >
          {region.nombre.replace("Región de ", "").replace("Región del ", "")}
        </Link>
      </li>
    ));

  return (
    <footer className="bg-brand-dark text-white font-montserrat ">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        {/* Logo + Copy */}
        <div className="flex flex-col items-start">
          <img
            src={logo}
            alt="farmacia-de-turno.cl"
            className="h-12 lg:h-[70px] w-auto mb-4 invert"
          />
        </div>

        {/* Regiones Norte */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Regiones Norte</h3>
          <ul className="space-y-2 text-sm text-brand-background/90">
            {renderLinks(REGIONES_NORTE)}
          </ul>
        </div>

        {/* Regiones Centro */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Regiones Centro</h3>
          <ul className="space-y-2 text-sm text-brand-background/90">
            {renderLinks(REGIONES_CENTRO)}
          </ul>
        </div>

        {/* Regiones Sur */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Regiones Sur</h3>
          <ul className="space-y-2 text-sm text-brand-background/90">
            {renderLinks(REGIONES_SUR)}
          </ul>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-brand-muted text-center py-4 text-xs text-brand-background/80 px-4">
        Hecho con ❤️ para ayudarte a encontrar tu farmacia de turno.
      </div>
    </footer>
  );
}

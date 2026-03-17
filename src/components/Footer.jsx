// Footer.jsx
import { Link } from "react-router";
import { REGIONES } from "../data/regiones.js";

const REGIONES_NORTE = [1, 2, 3, 4, 5];
const REGIONES_CENTRO = [6, 7, 8, 9, 16];
const REGIONES_SUR = [10, 11, 12, 13, 14, 15];

const logo = "/img/farmacia-de-turno-horizontal.webp";

export default function Footer() {
  const renderLinks = (ids) =>
    REGIONES.filter((r) => ids.includes(r.id_api)).map((region) => (
      <li key={region.slug}>
        <Link
          to={`/regiones/${region.slug}`}
          className="hover:text-white transition-colors duration-150"
        >
          {region.nombre.replace("Región de ", "").replace("Región del ", "")}
        </Link>
      </li>
    ));

  return (
    <footer className="bg-brand-dark text-brand-background font-montserrat">

      {/* Cuerpo */}
      <div className="container mx-auto px-4 py-8 md:py-10">

        {/* Logo + descripción — full width en mobile, columna en desktop */}
        <div className="mb-8 md:hidden">
          <img
            src={logo}
            alt="FarmaciasHoy.cl"
            className="h-8 w-auto mb-3 invert"
          />
          <p className="text-xs text-brand-background/55 leading-relaxed max-w-xs">
            Información diaria de farmacias de turno en Chile, por región y comuna.
          </p>
        </div>

        {/* Grid mobile: 2 cols — desktop: 4 cols */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">

          {/* Logo col — solo desktop */}
          <div className="hidden md:flex flex-col">
            <img
              src={logo}
              alt="FarmaciasHoy.cl"
              className="w-[100px] h-auto mb-4 invert"
            />
            <p className="text-xs text-brand-background/55 leading-relaxed">
              Información diaria de farmacias de turno en Chile, por región y comuna.
            </p>
          </div>

          {/* Norte */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-brand-background/40 mb-3">
              Norte
            </h3>
            <ul className="space-y-2 text-sm text-brand-background/75">
              {renderLinks(REGIONES_NORTE)}
            </ul>
          </div>

          {/* Centro */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-brand-background/40 mb-3">
              Centro
            </h3>
            <ul className="space-y-2 text-sm text-brand-background/75">
              {renderLinks(REGIONES_CENTRO)}
            </ul>
          </div>

          {/* Sur */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-brand-background/40 mb-3">
              Sur
            </h3>
            <ul className="space-y-2 text-sm text-brand-background/75">
              {renderLinks(REGIONES_SUR)}
            </ul>
          </div>

        </div>
      </div>

      {/* Franja inferior */}
      <div className="border-t border-brand-background/10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-brand-background/40">

          {/* Mobile */}
          <p className="text-center md:hidden">
            © {new Date().getFullYear()} FarmaciasHoy.cl · Hecho con ♥ para ayudarte a encontrar tu farmacia de turno
          </p>
          <p className="text-center md:hidden">
            <Link to="/politica-de-privacidad" className="hover:text-brand-background/80 transition-colors">
              Política de privacidad
            </Link>
          </p>

          {/* Desktop */}
          <span className="hidden md:block">© {new Date().getFullYear()} FarmaciasHoy.cl</span>
          <span className="hidden md:block">Hecho con ♥ para ayudarte a encontrar tu farmacia de turno</span>
          <div className="hidden md:flex gap-4">
            <Link to="/politica-de-privacidad" className="hover:text-brand-background/80 transition-colors">
              Privacidad
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
}

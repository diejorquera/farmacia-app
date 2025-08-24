import { Link } from "react-router-dom";
import logo from "../assets/farmacia-de-turno-horizontal.svg";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white font-montserrat mt-12">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        {/* Logo + Copy */}
        <div className="flex flex-col items-start">
          <img
            src={logo}
            alt="farmacia-de-turno.cl"
            className="h-10 w-auto mb-4"
          />
          <p className="text-sm text-brand-muted/90">
            © {new Date().getFullYear()} farmacia-de-turno.cl  
          </p>
          <Link
            to="/politicas"
            className="text-sm mt-2 underline hover:text-white"
          >
            Políticas
          </Link>
        </div>

        {/* Regiones Norte */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Regiones Norte</h3>
          <ul className="space-y-2 text-sm text-brand-background/90">
            <li><Link to="/regiones/arica" className="hover:text-white">Arica y Parinacota</Link></li>
            <li><Link to="/regiones/tarapaca" className="hover:text-white">Tarapacá</Link></li>
            <li><Link to="/regiones/antofagasta" className="hover:text-white">Antofagasta</Link></li>
            <li><Link to="/regiones/atacama" className="hover:text-white">Atacama</Link></li>
            <li><Link to="/regiones/coquimbo" className="hover:text-white">Coquimbo</Link></li>
          </ul>
        </div>

        {/* Regiones Centro */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Regiones Centro</h3>
          <ul className="space-y-2 text-sm text-brand-background/90">
            <li><Link to="/regiones/valparaiso" className="hover:text-white">Valparaíso</Link></li>
            <li><Link to="/regiones/metropolitana" className="hover:text-white">Metropolitana</Link></li>
            <li><Link to="/regiones/ohiggins" className="hover:text-white">O’Higgins</Link></li>
            <li><Link to="/regiones/maule" className="hover:text-white">Maule</Link></li>
          </ul>
        </div>

        {/* Regiones Sur */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Regiones Sur</h3>
          <ul className="space-y-2 text-sm text-brand-background/90">
            <li><Link to="/regiones/biobio" className="hover:text-white">Biobío</Link></li>
            <li><Link to="/regiones/araucania" className="hover:text-white">Araucanía</Link></li>
            <li><Link to="/regiones/los-rios" className="hover:text-white">Los Ríos</Link></li>
            <li><Link to="/regiones/los-lagos" className="hover:text-white">Los Lagos</Link></li>
            <li><Link to="/regiones/aysen" className="hover:text-white">Aysén</Link></li>
            <li><Link to="/regiones/magallanes" className="hover:text-white">Magallanes</Link></li>
          </ul>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-brand-muted text-center py-4 text-xs text-brand-background/80">
        Hecho con ❤️ para ayudarte a encontrar tu farmacia de turno.
      </div>
    </footer>
  );
}

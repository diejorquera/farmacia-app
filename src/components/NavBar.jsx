import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/farmacia-de-turno-horizontal.svg";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const base =
    "px-3 py-2 rounded-lg text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/40";
  const idle = "text-brand-dark/80 hover:text-brand-dark hover:bg-brand-dark/5";
  const active = "text-white bg-brand-dark hover:bg-brand-dark";

  const linkClass = ({ isActive }) => `${base} ${isActive ? active : idle}`;

  const closeOnNav = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-dark/10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <nav
        className="max-w-6xl mx-auto px-4 md:px-6"
        role="navigation"
        aria-label="Principal"
      >
        <div className="flex items-center justify-between py-3">
          {/* Logo a la izquierda */}
          <Link
            to="/"
            className="inline-flex items-center gap-3"
            aria-label="Ir al inicio"
            onClick={closeOnNav}
          >
            <img
              src={logo}
              alt="farmacia-de-turno.cl"
              className="h-9 w-auto select-none"
              draggable="false"
            />
          </Link>

          {/* Botón mobile */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-brand-dark/80 hover:bg-brand-dark/5 outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/40"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-controls="menu-principal"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menú</span>
            <span
              className={`block w-6 h-0.5 bg-brand-dark transition ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-brand-dark my-1 transition ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-brand-dark transition ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={linkClass}>
              Inicio
            </NavLink>
            <NavLink to="/regiones" className={linkClass}>
              Buscar por regiones
            </NavLink>
            <NavLink to="/quienes-somos" className={linkClass}>
              ¿Quiénes somos?
            </NavLink>
            <NavLink to="/contacto" className={linkClass}>
              Contacto
            </NavLink>
          </div>
        </div>

        {/* Menú mobile */}
        <div
          id="menu-principal"
          className={`md:hidden ${open ? "grid" : "hidden"} gap-2 pb-3`}
        >
          <NavLink to="/" end className={linkClass} onClick={closeOnNav}>
            Inicio
          </NavLink>
          <NavLink to="/regiones" className={linkClass} onClick={closeOnNav}>
            Buscar por regiones
          </NavLink>
          <NavLink
            to="/quienes-somos"
            className={linkClass}
            onClick={closeOnNav}
          >
            ¿Quiénes somos?
          </NavLink>
          <NavLink to="/contacto" className={linkClass} onClick={closeOnNav}>
            Contacto
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

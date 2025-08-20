import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/Logo.svg";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const linkBase = "px-3 py-2 rounded-md";
  const linkActive = "bg-gray-200 text-gray-900";
  const linkIdle = "text-gray-700 hover:bg-gray-100";

  return (
    <header className="border-b bg-white">
      <nav
        className="max-w-6xl mx-auto px-4"
        role="navigation"
        aria-label="Principal"
      >
        <div className="flex items-center justify-between py-3">
          {/* Logo / Marca */}
          <Link to="/" className="text-xl font-bold text-gray-900">
<img src={logo} alt="Logo" className="h-10 w-auto" />          </Link>

          {/* Botón mobile */}
          <button
            type="button"
            className="md:hidden p-2 rounded hover:bg-gray-100"
            aria-label="Abrir menú"
            aria-controls="menu-principal"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {/* Ícono hamburguesa simple */}
            <span className="block w-6 h-0.5 bg-gray-800 mb-1" />
            <span className="block w-6 h-0.5 bg-gray-800 mb-1" />
            <span className="block w-6 h-0.5 bg-gray-800" />
          </button>

          {/* Links desktop */}
          <div className="hidden md:flex gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/regiones"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              Regiones
            </NavLink>
          </div>
        </div>

        {/* Menú mobile */}
        <div
          id="menu-principal"
          className={`${open ? "block" : "hidden"} md:hidden pb-3`}
        >
          <div className="flex flex-col gap-2">
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/regiones"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              Regiones
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

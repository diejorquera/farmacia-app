// src/routes.ts  ← archivo NUEVO en src/
// React Router framework mode lo requiere obligatoriamente.
// Define las rutas usando el helper "route" de @react-router/dev.
import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("pages/Home.jsx"),
  route("regiones", "pages/Regiones.jsx"),
  // más específica primero
  route("regiones/:regionSlug/:comunaToken", "pages/ComunaPage.jsx"),
  route("regiones/:slug", "pages/RegionPage.jsx"),
  route("quienes-somos", "pages/QuienesSomos.jsx"),
  route("contacto", "pages/Contacto.jsx"),
  route("*", "pages/NotFound.jsx"),
] satisfies RouteConfig;

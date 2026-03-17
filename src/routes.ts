// src/routes.ts
import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("pages/Home.jsx"),
  route("regiones", "pages/Regiones.jsx"),
  // más específica primero
  route("regiones/:regionSlug/:comunaToken", "pages/ComunaPage.jsx"),
  route("regiones/:slug", "pages/RegionPage.jsx"),
  route("quienes-somos", "pages/QuienesSomos.jsx"),
  route("contacto", "pages/Contacto.jsx"),
  route("politica-de-privacidad", "pages/PoliticaPrivacidad.jsx"),
  route("*", "pages/NotFound.jsx"),
] satisfies RouteConfig;

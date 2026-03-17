// src/App.jsx  

export default [
  {
    index: true,
    lazy: () => import("./pages/Home"),
  },
  {
    path: "regiones",
    lazy: () => import("./pages/Regiones"),
  },
  {
    // más específica primero, igual que antes
    path: "regiones/:regionSlug/:comunaToken",
    lazy: () => import("./pages/ComunaPage"),
  },
  {
    path: "regiones/:slug",
    lazy: () => import("./pages/RegionPage"),
  },
  {
    path: "quienes-somos",
    lazy: () => import("./pages/QuienesSomos"),
  },
  {
    path: "contacto",
    lazy: () => import("./pages/Contacto"),
  },
  {
    path: "*",
    lazy: () => import("./pages/NotFound"),
  },
];
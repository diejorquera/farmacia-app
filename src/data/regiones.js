export const REGIONES = [
  {
    id_api: 1,
    nombre: "Región de Arica y Parinacota",
    slug: "arica-y-parinacota",
    imagen: "/img/Arica-y-Parinacota.webp",
  },
  {
    id_api: 2,
    nombre: "Región de Tarapacá",
    slug: "tarapaca",
    imagen: "/img/Tarapaca.webp",
  },
  {
    id_api: 3,
    nombre: "Región de Antofagasta",
    slug: "antofagasta",
    imagen: "/img/Antofagasta.webp",
  },
  {
    id_api: 4,
    nombre: "Región de Atacama",
    slug: "atacama",
    imagen: "/img/Atacama.webp",
  },
  {
    id_api: 5,
    nombre: "Región de Coquimbo",
    slug: "coquimbo",
    imagen: "/img/Coquimbo.webp",
  },
  {
    id_api: 6,
    nombre: "Región de Valparaíso",
    slug: "valparaiso",
    imagen: "/img/Valparaiso.webp",
  },
  {
    id_api: 7,
    nombre: "Región Metropolitana de Santiago",
    slug: "metropolitana-de-santiago",
    imagen: "/img/Santiago.webp",
  },
  {
    id_api: 8,
    nombre: "Región del Libertador General Bernardo O'Higgins",
    slug: "ohiggins",
    imagen: "/img/Ohiggins.webp",
  },
  {
    id_api: 9,
    nombre: "Región del Maule",
    slug: "maule",
    imagen: "/img/Maule.webp",
  },
  {
    id_api: 10,
    nombre: "Región del Biobío",
    slug: "biobio",
    imagen: "/img/Biobio.webp",
  },
  {
    id_api: 11,
    nombre: "Región de La Araucanía",
    slug: "la-araucania",
    imagen: "/img/Araucania.webp",
  },
  {
    id_api: 12,
    nombre: "Región de Los Ríos",
    slug: "los-rios",
    imagen: "/img/Rios.webp",
  },
  {
    id_api: 13,
    nombre: "Región de Los Lagos",
    slug: "los-lagos",
    imagen: "/img/Lagos.webp",
  },
  {
    id_api: 14,
    nombre: "Región de Aysén del General Carlos Ibáñez del Campo",
    slug: "aysen",
    imagen: "/img/Aysen.webp",
  },
  {
    id_api: 15,
    nombre: "Región de Magallanes y de la Antártica Chilena",
    slug: "magallanes",
    imagen: "/img/Magallanes.webp",
  },
  {
    id_api: 16,
    nombre: "Región de Ñuble",
    slug: "nuble",
    imagen: "/img/Nuble.webp",
  },
];

// accesos rápidos (útiles en tus páginas y fetch)
export const slugToRegion = Object.fromEntries(
  REGIONES.map((r) => [r.slug, r])
);
export const idToRegion = Object.fromEntries(
  REGIONES.map((r) => [r.id_api, r])
);

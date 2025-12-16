import { REGIONES } from "../data/regiones";
import { COMUNAS_CHILE } from "../data/comunas";

export const idToRegion = Object.fromEntries(
  REGIONES.map(r => [r.id_api, r])
);

export const slugToRegion = Object.fromEntries(
  REGIONES.map(r => [r.slug, r])
);

export const comunasPorRegion = Object.fromEntries(
  REGIONES.map(r => [
    r.id_api,
    COMUNAS_CHILE
      .filter(c => c.region_id === r.id_api)
      .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
  ])
);

export const idToComuna = Object.fromEntries(
  COMUNAS_CHILE.map(c => [c.id, c])
);

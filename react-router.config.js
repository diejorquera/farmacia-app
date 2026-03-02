// react-router.config.js  ← raíz del proyecto
import { REGIONES }      from "./src/data/regiones.js";
import { COMUNAS_CHILE } from "./src/data/comunas.js";

function slugify(str = "") {
  return str
    .toString().trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** @type {import("@react-router/dev/config").Config} */
export default {
  // ← Le dice a React Router que tu código está en src/ y no en app/
  appDirectory: "src",

  ssr: false,

  async prerender() {
    const staticRoutes = ["/", "/regiones", "/quienes-somos", "/contacto"];
    const regionRoutes = REGIONES.map((r) => `/regiones/${r.slug}`);
    const comunaRoutes = COMUNAS_CHILE.flatMap((c) => {
      const region = REGIONES.find((r) => Number(r.id_api) === Number(c.region_id));
      if (!region) return [];
      return [`/regiones/${region.slug}/farmacia-turno-${slugify(c.nombre)}`];
    });
    return [...staticRoutes, ...regionRoutes, ...comunaRoutes];
  },
};
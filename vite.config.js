import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// Si ya tienes slugify.js en src/utils, lo puedes importar.
// O lo dejas acá para que el config sea autosuficiente.
function slugify(str = "") {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sitemapAndRobotsPlugin() {
  let outDir = "dist";

  return {
    name: "generate-sitemap-and-robots",
    apply: "build",

    configResolved(config) {
      outDir = config.build.outDir || "dist";
    },

    async closeBundle() {
      // Dominio canónico
      const SITE = (process.env.VITE_SITE_URL || "https://farmaciashoy.cl").replace(/\/+$/, "");

      // Importa tus datos reales (desde src)
      const { REGIONES } = await import(path.resolve(process.cwd(), "src/data/regiones.js"));
      const { COMUNAS_CHILE } = await import(path.resolve(process.cwd(), "src/data/comunas.js"));

      const staticPaths = ["/", "/quienes-somos", "/regiones", "/contacto"];
      const regionPaths = REGIONES.map((r) => `/regiones/${r.slug}`);

      // Tus comunas: /regiones/:regionSlug/farmacia-turno-:comunaSlug
      // OJO: filtramos comunas por region_id
      const comunaPaths = COMUNAS_CHILE.map((c) => {
        const region = REGIONES.find((r) => Number(r.id_api) === Number(c.region_id));
        if (!region) return null;
        return `/regiones/${region.slug}/farmacia-turno-${slugify(c.nombre)}`;
      }).filter(Boolean);

      const urls = [...staticPaths, ...regionPaths, ...comunaPaths];

      function todayISO() {
        return new Date().toISOString().slice(0, 10);
      }

      function urlTag(loc, { priority = "0.80", changefreq = "weekly" } = {}) {
        return `
  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${todayISO()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTag("/", { priority: "1.0", changefreq: "weekly" })}
${urlTag("/quienes-somos", { priority: "0.90", changefreq: "monthly" })}
${urlTag("/regiones", { priority: "0.95", changefreq: "weekly" })}
${urlTag("/contacto", { priority: "0.70", changefreq: "monthly" })}
${regionPaths.map((p) => urlTag(p, { priority: "0.85", changefreq: "daily" })).join("")}
${comunaPaths.map((p) => urlTag(p, { priority: "0.75", changefreq: "daily" })).join("")}
</urlset>
`;

      const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

      // Escribir en dist
      const distPath = path.resolve(process.cwd(), outDir);
      fs.mkdirSync(distPath, { recursive: true });

      fs.writeFileSync(path.join(distPath, "sitemap.xml"), xml.trim(), "utf8");
      fs.writeFileSync(path.join(distPath, "robots.txt"), robots, "utf8");

      console.log("✅ sitemap.xml y robots.txt generados en:", distPath);
      console.log("• Total URLs:", urls.length);
    },
  };
}

export default defineConfig({
  plugins: [react(), sitemapAndRobotsPlugin()],
});

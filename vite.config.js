// vite.config.js 
import { defineConfig } from "vite";
import { reactRouter }  from "@react-router/dev/vite"; 
import fs   from "node:fs";
import path from "node:path";

function slugify(str = "") {
  return str
    .toString().trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sitemapAndRobotsPlugin() {
  let outDir = "dist";
  let isClient = false;
  return {
    name: "generate-sitemap-and-robots",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir || "dist";
      isClient = config.build.outDir?.includes("client") ?? true;
    },
    async closeBundle() {
      if (!isClient) return;
      const SITE = (process.env.VITE_SITE_URL || "https://www.farmaciashoy.cl").replace(/\/+$/, "");
      const { REGIONES }      = await import(path.resolve(process.cwd(), "src/data/regiones.js"));
      const { COMUNAS_CHILE } = await import(path.resolve(process.cwd(), "src/data/comunas.js"));

      const staticPaths = ["/", "/quienes-somos", "/regiones", "/contacto", "/politica-de-privacidad"];
      const regionPaths = REGIONES.map((r) => `/regiones/${r.slug}`);
      const comunaPaths = COMUNAS_CHILE.map((c) => {
        const region = REGIONES.find((r) => Number(r.id_api) === Number(c.region_id));
        if (!region) return null;
        return `/regiones/${region.slug}/farmacia-turno-${slugify(c.nombre)}`;
      }).filter(Boolean);

      function todayISO() { return new Date().toISOString().slice(0, 10); }
      function urlTag(loc, { priority = "0.80", changefreq = "weekly" } = {}) {
        return `\n  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${todayISO()}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTag("/", { priority: "1.0", changefreq: "weekly" })}
${urlTag("/quienes-somos", { priority: "0.90", changefreq: "monthly" })}
${urlTag("/regiones", { priority: "0.95", changefreq: "weekly" })}
${urlTag("/contacto", { priority: "0.70", changefreq: "monthly" })}
${urlTag("/politica-de-privacidad", { priority: "0.50", changefreq: "monthly" })}
${regionPaths.map((p) => urlTag(p, { priority: "0.85", changefreq: "daily" })).join("")}
${comunaPaths.map((p) => urlTag(p, { priority: "0.75", changefreq: "daily" })).join("")}
</urlset>`;

      const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;

      // En framework mode el output estático va a dist/client
      const distPath  = path.resolve(process.cwd(), outDir);
      const clientDir = path.join(distPath, "client");
      const targetDir = fs.existsSync(clientDir) ? clientDir : distPath;
      fs.writeFileSync(path.join(targetDir, "sitemap.xml"), xml.trim(), "utf8");
      fs.writeFileSync(path.join(targetDir, "robots.txt"), robots, "utf8");
      console.log(`✅ sitemap.xml y robots.txt → ${targetDir}`);
      console.log(`• Total URLs: ${staticPaths.length + regionPaths.length + comunaPaths.length}`);
    },
  };
}

export default defineConfig({
  plugins: [
    reactRouter(),            
    sitemapAndRobotsPlugin(),
  ],
});
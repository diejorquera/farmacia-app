// scripts/generate-sitemap.js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 1) Ubicaciones
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");

// 2) Dominio canónico (sin trailing slash)
const SITE = (process.env.VITE_SITE_URL || "https://farmaciashoy.cl").replace(/\/+$/, "");

// 3) Importa regiones reales de tu app
const { REGIONES } = await import("../src/data/regiones.js");

// 4) Rutas a indexar (SIN “/” final)
const staticPaths = ["/", "/quienes-somos", "/regiones", "/contacto"];
const regionPaths = REGIONES.map((r) => `/regiones/${r.slug}`);

const urls = [...staticPaths, ...regionPaths];

// 5) Helpers
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

// 6) Construir XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTag("/", { priority: "1.0", changefreq: "weekly" })}
${urlTag("/quienes-somos", { priority: "0.90", changefreq: "weekly" })}
${urlTag("/regiones", { priority: "0.90", changefreq: "weekly" })}
${urlTag("/contacto", { priority: "0.90", changefreq: "weekly" })}
${regionPaths.map((p) => urlTag(p, { priority: "0.80", changefreq: "daily" })).join("")}
</urlset>
`;

// 7) robots.txt minimal (si no tienes /admin o /login reales)
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

// 8) Escribir a /dist
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml.trim(), "utf8");
fs.writeFileSync(path.join(distDir, "robots.txt"), robots, "utf8");

console.log("✅ Generados: dist/sitemap.xml y dist/robots.txt");

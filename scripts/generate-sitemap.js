// scripts/generate-sitemap.js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 1) Ubicaciones
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");

// 2) Dominio canónico (sin trailing slash)
// IMPORTANT: tu canonical real es con www (Vercel redirige apex -> www)
const SITE = (process.env.VITE_SITE_URL || "https://www.farmaciashoy.cl").replace(
  /\/+$/,
  ""
);

// 3) Importa data real de tu app
const { REGIONES } = await import("../src/data/regiones.js");
const { COMUNAS_CHILE } = await import("../src/data/comunas.js");

// 4) Helpers
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

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

function urlTag(loc, { priority = "0.80", changefreq = "weekly" } = {}) {
  return `
  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${todayISO()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// 5) Rutas (SIN “/” final)
const staticPaths = ["/", "/quienes-somos", "/regiones", "/contacto"];
const regionPaths = REGIONES.map((r) => `/regiones/${r.slug}`);

// map rápido: region_id -> slug
const regionIdToSlug = Object.fromEntries(REGIONES.map((r) => [r.id_api, r.slug]));

const comunaPaths = COMUNAS_CHILE.map((c) => {
  const regionSlug = regionIdToSlug[c.region_id];
  if (!regionSlug) return null;
  return `/regiones/${regionSlug}/farmacia-turno-${slugify(c.nombre)}`;
}).filter(Boolean);

// 6) Construir XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPaths
  .map((p) =>
    urlTag(p, {
      priority: p === "/" ? "1.0" : "0.90",
      changefreq: p === "/" || p === "/regiones" ? "weekly" : "monthly",
    })
  )
  .join("")}
${regionPaths
  .map((p) => urlTag(p, { priority: "0.85", changefreq: "daily" }))
  .join("")}
${comunaPaths
  .map((p) => urlTag(p, { priority: "0.75", changefreq: "daily" }))
  .join("")}
</urlset>
`;

// 7) robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

// 8) Escribir a /dist
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml.trim(), "utf8");
fs.writeFileSync(path.join(distDir, "robots.txt"), robots, "utf8");

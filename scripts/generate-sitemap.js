import { writeFileSync } from "node:fs";

const SITE = process.env.VITE_SITE_URL || "https://farmaciashoy.cl";

const regions = [
  "arica-y-parinacota",
  "tarapaca",
  "antofagasta",
  "atacama",
  "coquimbo",
  "valparaiso",
  "metropolitana-de-santiago",
  "ohiggins",
  "maule",
  "biobio",
  "la-araucania",
  "los-rios",
  "los-lagos",
  "aysen",
  "magallanes",
  "nuble",
];

const staticPaths = ["/", "/quienes-somos/", "/regiones/"];
const regionPaths = regions.map((slug) => `/regiones/${slug}/`);

function urlTag(loc, priority = "0.80", changefreq = "daily") {
  const today = new Date().toISOString().split("T")[0];
  return `
  <url>
    <loc>${SITE.replace(/\/$/, "")}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPaths.map((p) => urlTag(p, "0.90", "weekly")).join("")}
${regionPaths.map((p) => urlTag(p, "0.80", "daily")).join("")}
</urlset>`;

writeFileSync("public/sitemap.xml", xml.trim(), "utf8");
console.log("[sitemap] Generado public/sitemap.xml ✅");

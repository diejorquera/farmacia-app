import { cpSync } from "node:fs";

const env = process.env.VERCEL_ENV || "development";

const from =
  env === "production" ? "public/robots.txt" : "public/robots.staging.txt";

cpSync(from, "dist/robots.txt");
console.log(`[robots] Copiado ${from} → dist/robots.txt (entorno: ${env})`);

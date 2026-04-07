// src/services/farmacias.js

const ENDPOINT_TURNOS = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php";
const ENDPOINT_TODOS = "https://midas.minsal.cl/farmacia_v2/WS/getLocales.php";

/**
 * Cachés en memoria separadas.
 * Evita pegarle a los endpoints en cada navegación dentro de 5 minutos.
 */
const FIVE_MIN = 5 * 60 * 1000;

let cacheTurnos = { data: null, fetchedAt: 0 };
let cacheTodos = { data: null, fetchedAt: 0 };

/**
 * Función genérica para descargar JSON con caché.
 */
async function fetchWithCache(url, cacheObj, force = false) {
  const isStale = Date.now() - cacheObj.fetchedAt > FIVE_MIN;

  if (!force && cacheObj.data && !isStale) {
    return cacheObj.data;
  }

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Error al obtener datos del MINSAL (${url})`);
  }

  const data = await res.json();
  cacheObj.data = data;
  cacheObj.fetchedAt = Date.now();
  return data;
}

/**
 * Descarga el JSON completo de turnos del MINSAL.
 */
async function fetchTurnosRaw({ force = false } = {}) {
  return fetchWithCache(ENDPOINT_TURNOS, cacheTurnos, force);
}

/**
 * Descarga el JSON completo de TODAS las farmacias del MINSAL.
 */
async function fetchTodosRaw({ force = false } = {}) {
  return fetchWithCache(ENDPOINT_TODOS, cacheTodos, force);
}

/**
 * Retorna los locales EN TURNO de una región específica.
 * @param {number|string} idRegion - fk_region del MINSAL
 * @returns {Promise<Array>}
 */
export async function getTurnosPorRegion(idRegion) {
  const all = await fetchTurnosRaw();

  return all.filter(
    (x) => Number(x.fk_region ?? x.id_region) === Number(idRegion)
  );
}

/**
 * Retorna TODOS los locales (comerciales) de una región específica.
 * @param {number|string} idRegion - fk_region del MINSAL
 * @returns {Promise<Array>}
 */
export async function getTodosLosLocalesPorRegion(idRegion) {
  const all = await fetchTodosRaw();

  return all.filter(
    (x) => Number(x.fk_region ?? x.id_region) === Number(idRegion)
  );
}

/**
 * Normaliza un local del API a una estructura amigable para UI.
 */
export function normalizarLocal(x) {
  const id =
    x.id_local ??
    x.local_id ??
    // fallback estable si no viene id
    `${(x.local_nombre || "").trim()}|${(x.local_direccion || "").trim()}`;

  return {
    id,
    nombre: x.local_nombre ?? "",
    direccion: x.local_direccion ?? "",
    comuna: x.comuna_nombre ?? x.comuna ?? "",
    telefono: x.local_telefono ?? "",
    lat: x.local_lat ? Number(x.local_lat) : null,
    lng: x.local_lng ? Number(x.local_lng) : null,

    // IDs reales del MINSAL (útiles para SEO y rutas)
    regionId: x.fk_region ?? x.id_region ?? null,
    comunaId: x.fk_comuna ?? null,
    
    // Horarios (útiles para la API de todos los locales)
    horarioApertura: x.funcionamiento_hora_apertura ?? null,
    horarioCierre: x.funcionamiento_hora_cierre ?? null,
    esTurno: !!x.fecha || !!x.funcionamiento_dia
  };
}

/**
 * Devuelve las comunas ÚNICAS de una región,
 * como objetos { id, nombre }, ordenadas alfabéticamente.
 *
 * @param {number|string} idRegion
 * @returns {Promise<Array<{id: string|null, nombre: string}>>}
 */
export async function getComunasPorRegion(idRegion) {
  const items = await getTurnosPorRegion(idRegion);

  const map = new Map();

  for (const x of items) {
    const nombre = (x.comuna_nombre ?? x.comuna ?? "").trim();
    if (!nombre) continue;

    const id = x.fk_comuna != null ? String(x.fk_comuna) : null;

    // Key estable: primero por id, si no por nombre normalizado
    const key = id ? `id:${id}` : `n:${nombre.toLowerCase()}`;

    if (!map.has(key)) {
      map.set(key, { id, nombre });
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es")
  );
}

/**
 * Limpia manualmente la caché global (útil para debug).
 */
export function clearFarmaciasCache() {
  cacheTurnos = { data: null, fetchedAt: 0 };
  cacheTodos = { data: null, fetchedAt: 0 };
}
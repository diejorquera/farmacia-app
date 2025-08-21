// src/services/farmacias.js

// Endpoint público MINSAL
const ENDPOINT = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php";

// Caché simple en memoria para evitar pedir siempre el mismo JSON
let cache = {
  data: null,
  fetchedAt: 0,
};

/**
 * Descarga el JSON de turnos del MINSAL (con caché en memoria).
 * @returns {Promise<Array>} array de locales en turno (todas las regiones)
 */
async function fetchTurnosRaw({ force = false } = {}) {
  // invalida caché cada 5 minutos
  const FIVE_MIN = 5 * 60 * 1000;
  const isStale = Date.now() - cache.fetchedAt > FIVE_MIN;

  if (!force && cache.data && !isStale) {
    return cache.data;
  }

  const res = await fetch(ENDPOINT, { method: "GET" });
  if (!res.ok) throw new Error("Error al obtener datos del MINSAL");

  const data = await res.json();
  cache = { data, fetchedAt: Date.now() };
  return data;
}

/**
 * Retorna los locales de una región (filtrados por id de región del MINSAL).
 * @param {number|string} idRegion - id_api de tu catálogo (1..16)
 * @returns {Promise<Array>} locales en esa región
 */
export async function getTurnosPorRegion(idRegion) {
  const all = await fetchTurnosRaw();
  // El dataset puede traer 'fk_region' o 'id_region' según versión; cubrimos ambas
  return all.filter(
    (x) => Number(x.fk_region ?? x.id_region) === Number(idRegion)
  );
}

/**
 * Normaliza un registro del API a un objeto más cómodo para la UI.
 * @param {object} x - item del API
 * @returns {object} item normalizado
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
    // Props útiles adicionales por si luego los quieres usar:
    // horario: x.funcionamiento_horario ?? "",
    // horarioSabado: x.funcionamiento_horario_sab ?? "",
    // horarioDomingo: x.funcionamiento_horario_dom ?? "",
  };
}

/**
 * Utilidad opcional: obtener comunas únicas de una región (para filtros <select>)
 * @param {number|string} idRegion
 * @returns {Promise<string[]>} comunas únicas ordenadas alfabéticamente
 */
export async function getComunasPorRegion(idRegion) {
  const items = await getTurnosPorRegion(idRegion);
  const set = new Set(
    items
      .map((x) => (x.comuna_nombre ?? x.comuna ?? "").trim())
      .filter(Boolean)
  );
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/**
 * Limpia manualmente la caché (por si quieres forzar refresco).
 */
export function clearFarmaciasCache() {
  cache = { data: null, fetchedAt: 0 };
}

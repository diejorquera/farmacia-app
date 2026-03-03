const ENDPOINT = "/api/turno";

/**
 * Caché simple en memoria (compartida por toda la app).
 * Evita pegarle al endpoint en cada navegación.
 */
let cache = {
  data: null,
  fetchedAt: 0,
};

/**
 * Descarga el JSON completo de turnos (con caché).
 */
async function fetchTurnosRaw({ force = false } = {}) {
  const FIVE_MIN = 5 * 60 * 1000;
  const isStale = Date.now() - cache.fetchedAt > FIVE_MIN;

  if (!force && cache.data && !isStale) {
    return cache.data;
  }

  const res = await fetch(ENDPOINT, { method: "GET" });
  if (!res.ok) {
    throw new Error("Error al obtener datos del MINSAL");
  }

  const data = await res.json();
  cache = { data, fetchedAt: Date.now() };
  return data;
}

/**
 * Retorna los locales en turno de una región específica.
 */
export async function getTurnosPorRegion(idRegion) {
  const all = await fetchTurnosRaw();
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
    `${(x.local_nombre || "").trim()}|${(x.local_direccion || "").trim()}`;

  return {
    id,
    nombre: x.local_nombre ?? "",
    direccion: x.local_direccion ?? "",
    comuna: x.comuna_nombre ?? x.comuna ?? "",
    telefono: x.local_telefono ?? "",
    lat: x.local_lat ? Number(x.local_lat) : null,
    lng: x.local_lng ? Number(x.local_lng) : null,
    regionId: x.fk_region ?? x.id_region ?? null,
    comunaId: x.fk_comuna ?? null,
  };
}

/**
 * Devuelve las comunas únicas de una región con turno hoy.
 */
export async function getComunasPorRegion(idRegion) {
  const items = await getTurnosPorRegion(idRegion);
  const map = new Map();

  for (const x of items) {
    const nombre = (x.comuna_nombre ?? x.comuna ?? "").trim();
    if (!nombre) continue;
    const id = x.fk_comuna != null ? String(x.fk_comuna) : null;
    const key = id ? `id:${id}` : `n:${nombre.toLowerCase()}`;
    if (!map.has(key)) map.set(key, { id, nombre });
  }

  return Array.from(map.values()).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es")
  );
}

/**
 * Limpia manualmente la caché global.
 */
export function clearFarmaciasCache() {
  cache = { data: null, fetchedAt: 0 };
}
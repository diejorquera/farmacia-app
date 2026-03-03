export default async function handler(req, res) {
  const ENDPOINT = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php";

  try {
    const response = await fetch(ENDPOINT, { method: "GET" });

    if (!response.ok) {
      return res.status(502).json({ error: "Error al obtener datos del MINSAL" });
    }

    const data = await response.json();

    // Permitir llamadas desde el browser
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Cache de 5 minutos en Vercel Edge (mismo tiempo que tu caché en memoria)
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error interno del proxy" });
  }
}
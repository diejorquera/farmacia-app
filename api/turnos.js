export default async function handler(req, res) {
  const ENDPOINT = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php";

  try {
    const response = await fetch(ENDPOINT, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "es-CL,es;q=0.9",
        "Referer": "https://www.farmaciashoy.cl/",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: `MINSAL respondió ${response.status}` });
    }

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
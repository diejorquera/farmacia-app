const WEBS4ALL_URL = "https://webs4all.cl";

/** Arma el enlace a webs4all.cl con UTM para saber qué banner trae clientes. */
export function buildHref(campaign, path = "") {
  const params = new URLSearchParams({
    utm_source: "farmaciashoy",
    utm_medium: "banner",
    utm_campaign: campaign,
  });
  return `${WEBS4ALL_URL}${path}?${params.toString()}`;
}

// src/lib/analytics.js

/**
 * Inicializa Google Analytics 4 de forma segura.
 * - Sin inline scripts (CSP-friendly)
 * - send_page_view: false para evitar duplicados en SPA
 */
export function initGA(measurementId) {
  if (!measurementId) return;
  if (typeof window === "undefined") return;
  if (window.__ga_initialized__) return;

  window.__ga_initialized__ = true;

  // Define dataLayer y gtag() antes de cargar la librería
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(){ window.dataLayer.push(arguments); };

  // Marca de arranque
  window.gtag("js", new Date());

  // Desactiva page_view automático (lo mandamos manualmente con el hook)
  window.gtag("config", measurementId, { send_page_view: false });

  // Carga librería GA4
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s);
}

/**
 * Envía un page_view manual (SPA con React Router).
 */
export function trackPageView({ path, title, locationUrl } = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path ?? window.location.pathname + window.location.search,
    page_title: title ?? document.title,
    page_location: locationUrl ?? window.location.href,
  });
}

/**
 * Envía un evento personalizado (clics, búsquedas, etc.).
 */
export function track(eventName, params = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}

// src/lib/analytics.js
export function initGA(measurementId) {
  if (!measurementId) return;
  // Evitar duplicados si HMR recarga módulos en dev
  if (window.__ga_initialized__) return;
  window.__ga_initialized__ = true;

  // Carga gtag.js
  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s1);

  // Config base
  const s2 = document.createElement("script");
  s2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(s2);
}

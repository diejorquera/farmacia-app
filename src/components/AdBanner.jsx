// src/components/AdBanner.jsx
import { useEffect, useRef } from "react";

const SCRIPT_BASE = "https://bauval.org";

/**
 * Anuncios de Adsterra.
 *
 * type="banner": formato iframe (atOptions). Se monta en un <iframe sandbox>
 * con el HTML del anuncio pasado por `srcdoc` (no por document.write en un
 * documento ya cargado, que los navegadores modernos bloquean si viene de un
 * script insertado dinámicamente). El atributo `sandbox` aísla el script de
 * Adsterra: puede ejecutar JS y abrir una pestaña si el usuario hace click,
 * pero no puede leer cookies/localStorage ni tocar el DOM del sitio real —
 * solo su propio recuadro.
 *
 * type="native": banner nativo. Por diseño del formato, Adsterra necesita
 * pintar dentro del flujo de la página (hereda estilos) y por eso NO se
 * puede aislar en un iframe sandbox sin romper el formato — se inyecta
 * directo en el DOM dentro del contenedor con el id que Adsterra espera.
 */
export default function AdBanner({ type, adKey, width, height, className = "" }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !adKey) return;

    if (type === "banner") {
      const html =
        `<!DOCTYPE html><html><head><style>html,body{margin:0;padding:0;overflow:hidden;}</style></head><body>` +
        `<script>atOptions=${JSON.stringify({ key: adKey, format: "iframe", height, width, params: {} })};</script>` +
        `<script src="${SCRIPT_BASE}/22/${adKey}"></script>` +
        `</body></html>`;

      const iframe = document.createElement("iframe");
      iframe.width = String(width);
      iframe.height = String(height);
      iframe.style.border = "none";
      iframe.style.overflow = "hidden";
      iframe.scrolling = "no";
      iframe.title = "Publicidad";
      iframe.setAttribute("sandbox", "allow-scripts allow-popups allow-popups-to-escape-sandbox");
      iframe.srcdoc = html;
      host.appendChild(iframe);

      return () => {
        if (host.contains(iframe)) host.removeChild(iframe);
      };
    }

    if (type === "native") {
      const container = document.createElement("div");
      container.id = `container-${adKey}`;
      host.appendChild(container);

      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = `${SCRIPT_BASE}/21/${adKey}`;
      host.appendChild(script);

      return () => {
        host.innerHTML = "";
      };
    }
  }, [type, adKey, width, height]);

  return <div ref={hostRef} className={className} />;
}

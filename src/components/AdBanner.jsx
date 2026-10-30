// src/components/AdBanner.jsx
import { useEffect, useRef } from "react";

const SCRIPT_BASE = "https://bauval.org";

/**
 * Anuncios de Adsterra.
 *
 * type="banner": formato iframe (atOptions). Los T&C de Adsterra prohíben
 * poner el código del anuncio dentro de un <iframe>, así que, igual que
 * type="native", se inyecta directo en el DOM: un <script> con el objeto
 * atOptions seguido del <script src> que invoca el anuncio (Adsterra arma
 * su propio iframe internamente cuando corresponde).
 *
 * type="native": banner nativo. Se inyecta directo en el DOM dentro del
 * contenedor con el id que Adsterra espera.
 */
export default function AdBanner({ type, adKey, width, height, className = "" }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !adKey) return;

    if (type === "banner") {
      const config = document.createElement("script");
      config.type = "text/javascript";
      config.text = `atOptions = ${JSON.stringify({ key: adKey, format: "iframe", height, width, params: {} })};`;
      host.appendChild(config);

      const invoke = document.createElement("script");
      invoke.type = "text/javascript";
      invoke.src = `${SCRIPT_BASE}/22/${adKey}`;
      host.appendChild(invoke);

      return () => {
        host.innerHTML = "";
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

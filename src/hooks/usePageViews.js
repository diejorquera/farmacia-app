// src/hooks/usePageViews.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

/**
 * Envía un page_view en el primer render y en cada cambio de ruta.
 * Usa el título actual del documento (lo seteas en cada página).
 */
export function usePageViews() {
  const location = useLocation();

  useEffect(() => {
    trackPageView({
      path: location.pathname + location.search,
      title: document.title,
      locationUrl: window.location.href,
    });
  }, [location]);
}

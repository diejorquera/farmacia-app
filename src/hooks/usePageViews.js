// src/hooks/usePageViews.js
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { initGA, trackPageView } from "../lib/analytics";

export function usePageViews() {
  const location = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initGA("G-8NGG42Y5QJ");
      initialized.current = true;
    }
    trackPageView({
      path: location.pathname + location.search,
      title: document.title,
      locationUrl: window.location.href,
    });
  }, [location]);
}
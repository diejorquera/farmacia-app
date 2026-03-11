// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // instant = sin animación; usa "smooth" si prefieres animación
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

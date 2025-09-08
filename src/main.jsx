import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

// --- Google Analytics ---
function initGA(measurementId) {
  if (!measurementId) return;
  if (window.__ga_initialized__) return; // evita duplicados
  window.__ga_initialized__ = true;

  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s1);

  const s2 = document.createElement("script");
  s2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(s2);
}

// Solo en producción y si existe el ID
if (import.meta.env.PROD && import.meta.env.VITE_GA_ID) {
  initGA(import.meta.env.VITE_GA_ID);
}

// --- React App ---
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

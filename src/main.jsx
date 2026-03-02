// src/main.jsx  ← REEMPLAZA el actual
// HydratedRouter toma el HTML estático generado en el build
// y lo hidrata en el browser para que funcione como SPA.
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { initGA } from "./lib/analytics";
import "./index.css";

if (import.meta.env.PROD && import.meta.env.VITE_GA_ID) {
  initGA(import.meta.env.VITE_GA_ID);
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
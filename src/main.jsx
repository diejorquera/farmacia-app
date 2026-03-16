// src/main.jsx  
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { initGA } from "./lib/analytics";
import "./index.css";

if (typeof window !== "undefined") {
  initGA("G-8NGG42Y5QJ");
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
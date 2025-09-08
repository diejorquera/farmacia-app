// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { initGA } from "./lib/analytics";

if (import.meta.env.PROD && import.meta.env.VITE_GA_ID) {
  initGA(import.meta.env.VITE_GA_ID);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

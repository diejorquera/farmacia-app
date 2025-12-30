// src/App.jsx
import NotFound from "./pages/NotFound";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Regiones from "./pages/Regiones";
import RegionPage from "./pages/RegionPage";
import ComunaPage from "./pages/ComunaPage";
import QuienesSomos from "./pages/QuienesSomos";
import Contacto from "./pages/Contacto";
import ScrollToTop from "./components/ScrollToTop";
import { usePageViews } from "./hooks/usePageViews";

export default function App() {
  usePageViews();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 w-full">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regiones" element={<Regiones />} />

          {/* más específica primero */}
        <Route
          path="/regiones/:regionSlug/:comunaToken"
          element={<ComunaPage />}
        />

          <Route path="/regiones/:slug" element={<RegionPage />} />

          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

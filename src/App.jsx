import NotFound from "./pages/NotFound";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Regiones from "./pages/Regiones";
import RegionPage from "./pages/RegionPage";
import QuienesSomos from "./pages/QuienesSomos";
import Contaco from "./pages/Contacto";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 w-full">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regiones" element={<Regiones />} />
          <Route path="/regiones/:slug" element={<RegionPage />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/contacto" element={<Contaco />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

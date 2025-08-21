import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Regiones from "./pages/Regiones";
import RegionPage from "./pages/RegionPage"; // 👈 NUEVO

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regiones" element={<Regiones />} />
          <Route path="/regiones/:slug" element={<RegionPage />} /> {/* 👈 NUEVO */}
          <Route path="*" element={<p className="p-6">Página no encontrada</p>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

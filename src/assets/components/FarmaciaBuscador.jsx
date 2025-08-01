// src/components/FarmaciaBuscador.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FarmaciaResultados } from "./FarmaciaResultados.jsx";
import { FormularioBusquedaFarmacia } from "./FormularioBusquedaFarmacia.jsx";

export function FarmaciaBuscador() {
  const [farmacias, setFarmacias] = useState([]);
  const [comunaTexto, setComunaTexto] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    axios
      .get("https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php")
      .then((res) => {
        setFarmacias(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener farmacias:", err);
      });
  }, []);

  const comunasUnicas = [...new Set(farmacias.map((f) => f.comuna_nombre))];

  const handleBuscar = (e) => {
    e.preventDefault();
    const comunaInput = comunaTexto.trim().toUpperCase();

    const comunaValida = comunasUnicas.includes(comunaInput);

    if (comunaValida) {
      const farmaciasComuna = farmacias.filter(
        (f) => f.comuna_nombre === comunaInput
      );
      setResultados(farmaciasComuna);
      setMensaje(`Mostrando farmacias en la comuna: ${comunaInput}`);
    } else {
      setResultados([]);
      setMensaje("No se encontraron farmacias para la comuna ingresada.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Buscar Farmacias de Turno</h1>

      <FormularioBusquedaFarmacia
        comunaTexto={comunaTexto}
        setComunaTexto={setComunaTexto}
        comunasUnicas={comunasUnicas}
        handleBuscar={handleBuscar}
      />

      {mensaje && <p className="mb-4 font-semibold text-blue-700">{mensaje}</p>}

      <FarmaciaResultados farmacias={resultados} />
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { FarmaciaResultados } from "./FarmaciaResultados.jsx";
import { FormularioBusquedaFarmacia } from "./FormularioBusquedaFarmacia.jsx";
import { capitalizarTextoComuna } from "../utils/capitalizarTextoComuna.js";

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
      setMensaje(`Farmacia(s) de turno en la Comuna de ${capitalizarTextoComuna(comunaInput)}`);

    } else {
      setResultados([]);
      setMensaje("😕 No hay farmacias para la comuna que escribiste. Prueba ingresando otra comuna válida. Recuerda: debes buscar por nombre de comuna, no por región o ciudad.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-brand-dark">Farmacias de Turno Hoy: Consulta Horarios y Ubicación Actualizada</h1>

      <FormularioBusquedaFarmacia
        comunaTexto={comunaTexto}
        setComunaTexto={setComunaTexto}
        comunasUnicas={comunasUnicas}
        handleBuscar={handleBuscar}
      />

      {mensaje && <p className="mb-4 font-semibold text-black">{mensaje}</p>}

      <FarmaciaResultados farmacias={resultados} />
    </div>
  );
}

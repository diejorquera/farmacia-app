import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FarmaciaResultados } from "./FarmaciaResultados.jsx";
import { FormularioBusquedaFarmacia } from "./FormularioBusquedaFarmacia.jsx";
import { capitalizarTextoComuna } from "../utils/capitalizarTextoComuna.js";
import { extractAuthorizedTerms } from "../utils/keywordMatcher.js";

// Normaliza para comparar con dataset MINSAL (UPPER + espacios colapsados)
const normUpper = (s) =>
  (s ?? "").toString().toUpperCase().replace(/\s+/g, " ").trim();

export function FarmaciaBuscador() {
  const [farmacias, setFarmacias] = useState([]);
  const [comunaTexto, setComunaTexto] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // 1) Cargar farmacias (MINSAL)
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php")
      .then((res) => setFarmacias(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Error al obtener farmacias:", err);
        setFarmacias([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // 2) Comunas únicas desde el batch (en mayúsculas, con espacios colapsados)
  const comunasUnicasUpper = useMemo(() => {
    const set = new Set(farmacias.map((f) => normUpper(f?.comuna_nombre)));
    return [...set];
  }, [farmacias]);

  // 3) Lista capitalizada para mostrar y usar en el matcher
  const comunasCapitalizadas = useMemo(
    () => comunasUnicasUpper.map((c) => capitalizarTextoComuna(c)),
    [comunasUnicasUpper]
  );

  const handleBuscar = (e) => {
    e.preventDefault();
    setMensaje("");
    setResultados([]);

    if (!farmacias.length) {
      setMensaje(
        "Aún estamos cargando datos. Intenta nuevamente en unos segundos."
      );
      return;
    }

    const consultaLibre = comunaTexto || "";

    // Extraer comuna válida desde la entrada libre (insensible a case/tildes, multi-palabra)
    const { chosen } = extractAuthorizedTerms(
      consultaLibre,
      comunasCapitalizadas
    );

    if (!chosen) {
      setMensaje(
        "😕 No encontramos coincidencias con comunas válidas. Escribe una consulta que incluya una comuna de Chile (ej.: “Necesito una farmacia en Talca”)."
      );
      return;
    }

    const chosenUpper = normUpper(chosen);

    if (!comunasUnicasUpper.includes(chosenUpper)) {
      setMensaje(
        "😕 La comuna detectada no está disponible en la fuente actual de turnos. Prueba con otra comuna."
      );
      return;
    }

    // Filtrar farmacias por comuna exacta
    const farmaciasComuna = farmacias.filter(
      (f) => normUpper(f?.comuna_nombre) === chosenUpper
    );

    setResultados(farmaciasComuna);
    setMensaje(
      `Farmacia(s) de turno en la Comuna de ${capitalizarTextoComuna(
        chosenUpper
      )}`
    );
  };

  return (
    <div>
      <h1 className="text-2xl lg:text-5xl font-bold mb-4 text-brand-dark text-center">
        Farmacias de turno en Chile: encuentra la farmacia abierta hoy en tu
        comuna
      </h1>

      <FormularioBusquedaFarmacia
        comunaTexto={comunaTexto}
        setComunaTexto={setComunaTexto}
        comunasUnicas={comunasCapitalizadas}
        handleBuscar={handleBuscar}
        inputProps={{
          autoCapitalize: "off",
          autoComplete: "off",
          spellCheck: false,
        }}
      />


      <FarmaciaResultados farmacias={resultados} />
    </div>
  );
}

// src/components/FarmaciaBuscador.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FarmaciaResultados } from "./FarmaciaResultados.jsx";
import { FormularioBusquedaFarmacia } from "./FormularioBusquedaFarmacia.jsx";
import { capitalizarTextoComuna } from "../utils/capitalizarTextoComuna.js";
import { extractAuthorizedTerms } from "../utils/keywordMatcher.js";
import { track } from "../lib/analytics"; // 👈 GA eventos

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
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : [];
        setFarmacias(arr);
        // GA: dataset cargado
        track("datos_minsal_cargados", { registros: arr.length });
      })
      .catch((err) => {
        console.error("Error al obtener farmacias:", err);
        setFarmacias([]);
        // GA: error carga dataset
        track("datos_minsal_error", { mensaje: String(err?.message || err) });
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
      // GA: búsqueda inválida
      track("buscar_farmacia_invalida", { input: consultaLibre });
      setMensaje(
        "😕 No encontramos coincidencias con comunas válidas. Escribe una consulta que incluya una comuna de Chile (ej.: “Necesito una farmacia en Talca”)."
      );
      return;
    }

    const chosenUpper = normUpper(chosen);

    if (!comunasUnicasUpper.includes(chosenUpper)) {
      // GA: comuna no disponible en dataset actual
      track("buscar_farmacia_no_disponible", { comuna: chosen });
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

    // GA: búsqueda válida
    track("buscar_farmacia", {
      comuna: capitalizarTextoComuna(chosenUpper),
      resultados: farmaciasComuna.length,
    });
  };

  return (
    <div>
      <section className="min-h-[300px] md:min-h[337px] 2xl:min-h-[432px] bg-[url('/img/herosm.webp')] md:bg-[url('/img/heromd.webp')] 2xl:bg-[url('/img/herolg.webp')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center">
        <div className="max-w-5xl w-full flex flex-col md:gap-8 gap-3 px-4 md:px-0">
          <h1 className="text-2xl lg:text-5xl font-bold text-brand-background text-center">
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
        </div>
      </section>

      <FarmaciaResultados farmacias={resultados} />
    </div>
  );
}

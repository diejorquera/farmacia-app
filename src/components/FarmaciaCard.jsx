// src/components/FarmaciaCard.jsx
import { capitalizarTextoUbicacion } from "../utils/capitalizarTextoUbicacion";
import marcador from "../assets/marcador.svg";
import reloj from "../assets/reloj.svg";
import telefono from "../assets/telefono.svg";
// 1. Importamos la función track que ya usas en tu proyecto
import { track } from "../lib/analytics";

function formatearHora(hora) {
  if (!hora) return null;
  return hora.length > 5 ? hora.slice(0, 5) : hora;
}

function estaAbierto(apertura, cierre) {
  if (!apertura || !cierre) return null;
  const ahora = new Date();
  const [hA, mA] = formatearHora(apertura).split(":").map(Number);
  const [hC, mC] = formatearHora(cierre).split(":").map(Number);
  const minutos = ahora.getHours() * 60 + ahora.getMinutes();
  const aperturaMin = hA * 60 + mA;
  const cierreMin = hC * 60 + mC;
  if (aperturaMin > cierreMin) {
    return minutos >= aperturaMin || minutos < cierreMin;
  }
  return minutos >= aperturaMin && minutos < cierreMin;
}

export function FarmaciaCard({ farmacia }) {
  const nombre = farmacia.local_nombre
    ? capitalizarTextoUbicacion(farmacia.local_nombre.replace(/^farmacia\s+/i, ""))
    : "Sin nombre";

  const direccion = farmacia.local_direccion
    ? capitalizarTextoUbicacion(farmacia.local_direccion)
    : null;

  const tieneUbicacion = farmacia.local_lat && farmacia.local_lng;
  const mapsUrl = tieneUbicacion
    ? `https://www.google.com/maps?q=${farmacia.local_lat},${farmacia.local_lng}`
    : null;

  const apertura = formatearHora(farmacia.funcionamiento_hora_apertura);
  const cierre = formatearHora(farmacia.funcionamiento_hora_cierre);
  const abierto = estaAbierto(apertura, cierre);

  // 2. Funciones para capturar el click
  const handleTrackLlamada = () => {
    track("clic_llamar", {
      farmacia_nombre: nombre,
      comuna: farmacia.comuna_nombre || farmacia.comuna,
      telefono: farmacia.local_telefono
    });
  };

  const handleTrackUbicacion = () => {
    track("clic_como_llegar", {
      farmacia_nombre: nombre,
      comuna: farmacia.comuna_nombre || farmacia.comuna
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-background shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-brand-background">
        <div>
          <h2 className="text-base font-semibold text-brand-dark leading-snug">
            Farmacia {nombre}
          </h2>
          {direccion && (
            <p className="text-xs text-brand-muted mt-0.5">{direccion}</p>
          )}
        </div>
        <span className="shrink-0 mt-0.5 text-xs font-medium bg-green-50 text-green-700 rounded-full px-3 py-1">
          De turno
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 flex flex-col gap-3">

        {/* Mapa */}
        {tieneUbicacion ? (
          <div className="relative rounded-xl overflow-hidden border border-brand-background h-[100px]">
            <iframe
              title={`Ubicación de ${farmacia.local_nombre}`}
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0, pointerEvents: "none" }}
              src={`https://www.google.com/maps?q=${farmacia.local_lat},${farmacia.local_lng}&hl=es&z=16&output=embed`}
              allowFullScreen
              loading="lazy"
            />
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleTrackUbicacion} // 3. Rastrear click en el mapa flotante
              className="absolute bottom-2 right-2 bg-white rounded-lg border border-brand-background w-7 h-7 flex items-center justify-center shadow-sm"
              aria-label="Abrir en Google Maps"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-brand-muted">
                <polyline points="15 3 21 3 21 9"/>
                <polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/>
                <line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </a>
          </div>
        ) : (
          <p className="text-sm text-brand-muted">Mapa no disponible</p>
        )}

        {/* Teléfono */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-brand-background flex items-center justify-center shrink-0">
            <img src={telefono} alt="" className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-brand-muted">Teléfono</p>
            {farmacia.local_telefono ? (
              <a
                href={`tel:${farmacia.local_telefono}`}
                onClick={handleTrackLlamada} // 4. Rastrear click en el enlace de texto
                className="text-sm text-brand-dark font-medium hover:underline"
              >
                {farmacia.local_telefono}
              </a>
            ) : (
              <p className="text-sm text-brand-muted">No disponible</p>
            )}
          </div>
        </div>

        {/* Horario */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-brand-background flex items-center justify-center shrink-0">
            <img src={reloj} alt="" className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-brand-muted">Horario de turno</p>
            {apertura && cierre ? (
              <div className="flex items-center gap-1.5">
                {abierto !== null && (
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${abierto ? "bg-green-500" : "bg-brand-muted/40"}`} />
                )}
                <p className="text-sm text-brand-muted">
                  {abierto === true && <span className="text-green-700 font-medium">Abierto · </span>}
                  {abierto === false && <span className="text-brand-muted">Cerrado · </span>}
                  {apertura} — {cierre} hrs
                </p>
              </div>
            ) : (
              <p className="text-sm text-brand-muted">Horario no especificado</p>
            )}
          </div>
        </div>

      </div>

      {/* Footer CTAs */}
      <div className="grid grid-cols-2 gap-2 px-4 pb-4">
        {farmacia.local_telefono ? (
          <a
            href={`tel:${farmacia.local_telefono}`}
            onClick={handleTrackLlamada} // 5. Rastrear click en botón llamar
            className="flex items-center justify-center gap-2 bg-brand-dark text-white font-medium text-sm rounded-xl py-2.5 transition-opacity hover:opacity-90 active:scale-95"
          >
            <img src={telefono} alt="" className="w-4 h-4 brightness-0 invert" />
            Llamar
          </a>
        ) : (
          <button disabled className="flex items-center justify-center gap-2 bg-brand-background text-brand-muted/50 font-medium text-sm rounded-xl py-2.5 cursor-not-allowed">
            <img src={telefono} alt="" className="w-4 h-4 opacity-30" />
            Llamar
          </button>
        )}

        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleTrackUbicacion} // 6. Rastrear click en botón Como llegar
            className="flex items-center justify-center gap-2 bg-brand-background text-brand-dark font-medium text-sm rounded-xl py-2.5 border border-brand-dark/20 transition-colors hover:bg-brand-dark hover:text-white active:scale-95"
          >
            <img src={marcador} alt="" className="w-4 h-4" />
            Cómo llegar
          </a>
        ) : (
          <button disabled className="flex items-center justify-center gap-2 bg-brand-background text-brand-muted/50 font-medium text-sm rounded-xl py-2.5 border border-brand-background cursor-not-allowed">
            <img src={marcador} alt="" className="w-4 h-4 opacity-30" />
            Cómo llegar
          </button>
        )}
      </div>

    </div>
  );
}
import { capitalizarTextoUbicacion } from "../utils/capitalizarTextoUbicacion";
import marcador from "../assets/marcador.svg";
import reloj from "../assets/reloj.svg";
import telefono from "../assets/telefono.svg";

export function FarmaciaCard({ farmacia }) {
  return (
    <div className="border rounded-md grid md:grid-cols-2 p-4 bg-brand-background text-brand-dark shadow-2xl border-l-[6px] border-l-[#1c2126]">
      <div className="pr-2 lg:pr-6">
        <h2 className="text-xl font-bold md:text-2xl mb-3">
          Farmacia{" "}
          {farmacia.local_nombre
            ? capitalizarTextoUbicacion(
                farmacia.local_nombre.replace(/^farmacia\s+/i, "")
              )
            : "Farmacia"}
        </h2>

        {/* Dirección */}
        <p className="flex items-center gap-2 md:text-lg font-semibold mb-1">
          <img src={marcador} alt="Marcador" className="w-5 h-5" />
          {farmacia.local_direccion ? (
            farmacia.local_lat && farmacia.local_lng ? (
              <a
                href={`https://www.google.com/maps?q=${farmacia.local_lat},${farmacia.local_lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-base font-light hover:font-bold transition-all duration-200"
              >
                {capitalizarTextoUbicacion(farmacia.local_direccion)}
              </a>
            ) : (
              capitalizarTextoUbicacion(farmacia.local_direccion)
            )
          ) : (
            <span className="text-gray-500 font-light">
              No se ha proporcionado dirección
            </span>
          )}
        </p>

        {/* Teléfono */}
        <p className="flex items-center gap-2 text-base md:text-lg font-semibold mb-1">
          <img src={telefono} alt="Teléfono" className="w-5 h-5" />
          {farmacia.local_telefono ? (
            <a
              href={`tel:${farmacia.local_telefono}`}
              className="text-sm md:text-base font-light hover:font-bold transition-all duration-200"
            >
              {farmacia.local_telefono}
            </a>
          ) : (
            <span className="text-gray-500 font-light">No disponible</span>
          )}
        </p>

        {/* Horario */}
        <p className="flex items-center gap-2 text-base md:text-lg font-semibold mb-3">
          <img src={reloj} alt="Horario" className="w-5 h-5" />
          <span className="text-sm md:text-base font-light">
            {farmacia.funcionamiento_hora_apertura &&
            farmacia.funcionamiento_hora_cierre ? (
              `${farmacia.funcionamiento_hora_apertura} a ${farmacia.funcionamiento_hora_cierre}`
            ) : (
              <span className="text-gray-500">Horario no especificado</span>
            )}
          </span>
        </p>
      </div>

      {/* Mapa */}
      {farmacia.local_lat && farmacia.local_lng ? (
        <div className="border rounded-md">
          <iframe
            title={`Ubicación de ${farmacia.local_nombre}`}
            width="100%"
            height="200"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${farmacia.local_lat},${farmacia.local_lng}&hl=es&z=17&output=embed`}
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p className="mt-4 text-gray-500 font-light">Mapa no disponible</p>
      )}
    </div>
  );
}

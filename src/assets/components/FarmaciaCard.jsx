// src/components/FarmaciaCard.jsx
export function FarmaciaCard({ farmacia }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-md transition">
      <h2 className="text-lg font-semibold">{farmacia.local_nombre}</h2>

      <p>
        <strong>Dirección:</strong>{" "}
        {farmacia.local_lat && farmacia.local_lng ? (
          <a
            href={`https://www.google.com/maps?q=${farmacia.local_lat},${farmacia.local_lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {farmacia.local_direccion}
          </a>
        ) : (
          farmacia.local_direccion
        )}
      </p>

      <p>
        <strong>Teléfono:</strong>{" "}
        <a href={`tel:${farmacia.local_telefono}`} className="text-blue-600 underline">
          {farmacia.local_telefono}
        </a>
      </p>

      <p>
        <strong>Horario:</strong> {farmacia.funcionamiento_hora_apertura} a {farmacia.funcionamiento_hora_cierre}
      </p>

      {farmacia.local_lat && farmacia.local_lng && (
        <div className="mt-4">
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
      )}
    </div>
  );
}

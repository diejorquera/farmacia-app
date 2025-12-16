{/* FAQ – Preguntas frecuentes */}
<section className="mt-12 max-w-4xl">
  <h2 className="text-xl md:text-2xl font-bold mb-4">
    Preguntas frecuentes sobre farmacias de turno
  </h2>

  <div className="space-y-6">
    <div>
      <h3 className="font-semibold">
        ¿Dónde puedo encontrar la farmacia de turno más cercana?
      </h3>
      <p className="text-gray-700">
        Puedes consultar el listado oficial de farmacias de turno por comuna.
        En esta región hay farmacias de turno en comunas como{" "}
        <strong>{comunasParaFaq.join(", ")}</strong>, con información de
        dirección, horario y teléfono actualizada diariamente.
      </p>
    </div>

    <div>
      <h3 className="font-semibold">
        ¿Cómo saber si hay farmacia de turno hoy en mi comuna?
      </h3>
      <p className="text-gray-700">
        Selecciona tu comuna en el listado superior o revisa directamente las
        comunas disponibles. Algunas comunas con farmacia de turno hoy son{" "}
        <strong>{comunasParaFaq.join(", ")}</strong>.
      </p>
    </div>

    <div>
      <h3 className="font-semibold">
        ¿Las farmacias de turno atienden de noche?
      </h3>
      <p className="text-gray-700">
        El horario depende de cada farmacia y comuna. Revisa siempre el horario
        publicado para la farmacia de turno en tu comuna antes de asistir.
      </p>
    </div>

    <div>
      <h3 className="font-semibold">
        ¿Puedo llamar o reservar medicamentos en una farmacia de turno?
      </h3>
      <p className="text-gray-700">
        Algunas farmacias permiten consultas telefónicas. Si la farmacia de
        turno muestra número de contacto, puedes llamar directamente para
        consultar disponibilidad.
      </p>
    </div>
  </div>

  {/* Listado explícito de comunas (SEO fuerte) */}
  {comunasParaFaq.length > 0 && (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">
        Comunas con farmacias de turno en esta región:
      </h3>
      <ul className="flex flex-wrap gap-2">
        {comunasParaFaq.map((nombre) => (
          <li
            key={nombre}
            className="px-3 py-1 bg-gray-100 rounded-md text-sm"
          >
            {nombre}
          </li>
        ))}
      </ul>
    </div>
  )}
</section>

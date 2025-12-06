// FAQSection.jsx
export const FAQSection = () => {
  const faqs = [
    {
      question: "¿Qué farmacia está de turno hoy en mi comuna?",
      answer:
        "En nuestra web puedes buscar farmacias de turno hoy en Chile escribiendo el nombre de tu comuna en el buscador o eligiendo tu región en el listado (por ejemplo, Arica, Coquimbo, Santiago, Calama, Antofagasta). Así puedes saber qué farmacia está de turno hoy y cuáles están abiertas ahora cerca de ti."
    },
    {
      question: "¿Cómo encuentro farmacias de turno en Arica, Coquimbo, Santiago u otras ciudades?",
      answer:
        "Primero selecciona la región correspondiente (por ejemplo, Región de Arica y Parinacota, Región de Coquimbo o Región Metropolitana). Luego verás un listado con farmacias de turno en Arica, farmacias de turno en Coquimbo, farmacias de turno en Santiago centro, San Bernardo, La Serena, Calama, Villarrica, Lautaro, Curicó y otras ciudades."
    },
    {
      question: "¿Las farmacias de turno están abiertas 24 horas, domingos y feriados?",
      answer:
        "Dependiendo de la comuna, algunas farmacias de turno están abiertas 24 horas y otras solo en ciertos horarios. En cada ficha podrás ver si se trata de una farmacia abierta ahora, si corresponde a una farmacia de urgencia o si solo cubre parte del día. También indicamos si la farmacia de turno atiende domingos, feriados y turnos de noche."
    },
    {
      question: "¿Cuál es la diferencia entre una farmacia de turno y una farmacia abierta normal?",
      answer:
        "Una farmacia abierta normal puede cerrar en la tarde, la noche o los fines de semana. En cambio, una farmacia de turno está designada para asegurar atención continua cuando el resto está cerrado. Por eso muchas búsquedas incluyen frases como farmacia de turno hoy, farmacias de turno hoy cerca de mí o farmacias de turno para hoy, especialmente en situaciones de urgencia."
    },
    {
      question: "¿Puedo ver solo las farmacias abiertas ahora o las farmacias de turno para hoy?",
      answer:
        "Sí. Nuestro objetivo es que puedas encontrar rápidamente farmacias abiertas hoy y farmacias de turno para hoy en tu comuna. En cada región destacamos las farmacias de turno hoy y, cuando corresponde, mostramos si están abiertas ahora o si su turno comienza más tarde. Así evitas llamar o ir a una farmacia que no está atendiendo."
    },
    {
      question: "¿La información de farmacias de turno es oficial y está actualizada?",
      answer:
        "La información sobre farmacias de turno en Chile se basa en datos oficiales del MINSAL y en turnos de farmacia publicados para cada comuna. Actualizamos los turnos de farmacia para hoy y los próximos días, de modo que puedas confiar en los horarios, direcciones y teléfonos al buscar farmacias de turno en Arica, Coquimbo, Santiago, Los Lagos, Biobío y otras regiones."
    },
    {
      question: "¿Cómo encuentro farmacias abiertas hoy cerca de mí?",
      answer:
        "Puedes usar el buscador escribiendo el nombre de tu comuna o ciudad (por ejemplo, Arica, Coquimbo, San Bernardo, La Serena, Vallenar, Pucón, Villarrica) o elegir directamente la región. El sitio te mostrará farmacias de turno hoy y farmacias abiertas hoy en tu zona, incluyendo opciones como farmacias 24 horas y farmacias abiertas ahora cuando existan en tu comuna."
    }
  ];

  return (
    <section
      className="pt-3 md:pt-6 px-6 lg:px-0"
      aria-label="Preguntas frecuentes sobre farmacias de turno en Chile"
    >
      <div className="lg:w-2/3 mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-brand-dark text-center">
          Preguntas frecuentes sobre farmacias de turno hoy
        </h2>
        <p className="text-center text-brand-muted mb-6">
          Resolvemos las dudas más comunes sobre farmacias de turno en Chile:
          farmacias abiertas hoy, turnos de farmacia por comuna, horarios,
          urgencias y búsqueda por región.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="border border-brand-muted/30 rounded-md p-4 bg-white"
            >
              <summary className="font-semibold cursor-pointer text-brand-dark">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm text-brand-muted leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

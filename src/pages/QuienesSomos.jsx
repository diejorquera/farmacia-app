// src/pages/QuienesSomos.jsx
import { Link } from "react-router";

const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";

// ─── META ─────────────────────────────────────────────────────────────────────
export function meta() {
  return [
    { title: "¿Quiénes somos? | FarmaciasHoy.cl" },
    {
      name: "description",
      content:
        "FarmaciasHoy.cl es un proyecto independiente y gratuito para encontrar farmacias de turno en Chile. Los datos provienen del Ministerio de Salud (MINSAL).",
    },
    { tagName: "link", rel: "canonical", href: `${CANONICAL_ORIGIN}/quienes-somos` },
  ];
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
export default function QuienesSomos() {
  return (
    <div className="min-h-screen bg-brand-background font-montserrat">

      {/* HERO */}
      <div className="min-h-[180px] md:min-h-[260px] bg-[url('/img/regionessm.webp')] md:bg-[url('/img/regionesmd.webp')] 2xl:bg-[url('/img/regioneslg.webp')] bg-cover bg-center bg-no-repeat flex flex-col justify-center py-3 md:py-5">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <nav className="text-sm text-brand-background mb-6" aria-label="Ruta de navegación">
            <ol className="flex items-center gap-2 list-none p-0 m-0">
              <li>
                <Link to="/" className="hover:underline text-brand-background/80">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="font-bold text-white">
                ¿Quiénes somos?
              </li>
            </ol>
          </nav>
          <h1 className="text-2xl lg:text-4xl font-bold text-brand-background mb-2">
            ¿Quiénes somos?
          </h1>
          <p className="text-brand-background/90 text-sm md:text-base">
            Un proyecto independiente y gratuito para encontrar la farmacia de turno más cercana en Chile.
          </p>
        </div>
      </div>

      {/* CONTENIDO */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 py-8 md:py-10 max-w-4xl space-y-10">

          {/* Aviso independencia — lo más importante para AdSense */}
          <div className="rounded-xl border border-brand-background bg-brand-background/40 px-5 py-4 text-sm text-brand-muted leading-relaxed">
            <strong className="text-brand-dark font-medium">FarmaciasHoy.cl es un proyecto independiente.</strong>{" "}
            No somos una empresa, entidad oficial ni tenemos ninguna afiliación con el Ministerio de Salud
            (MINSAL) ni con ninguna cadena de farmacias. Los datos que mostramos provienen de la API
            pública del MINSAL y se publican tal como están disponibles.
          </div>

          {/* Intro */}
          <div className="space-y-4">
            <p className="text-sm text-brand-muted leading-relaxed">
              FarmaciasHoy.cl nació como un proyecto personal con un objetivo simple: que cualquier
              persona en Chile pueda saber en segundos qué farmacia está de turno cerca de su casa,
              sin importar la hora ni el día.
            </p>
            <p className="text-sm text-brand-muted leading-relaxed">
              El sitio es de uso completamente gratuito y se financia mediante{" "}
              <strong className="text-brand-dark font-medium">publicidad de Google AdSense</strong>,
              que aparece en algunas secciones de la página.
            </p>
          </div>

          {/* Cards — misión, cómo funciona, cobertura */}
          <div className="grid md:grid-cols-3 gap-4">
            <article className="bg-brand-background rounded-xl p-5 space-y-2">
              <h2 className="text-base font-bold text-brand-dark">El objetivo</h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                Reducir el tiempo y la incertidumbre al buscar una farmacia de turno, con
                información clara y fácil de leer desde cualquier dispositivo.
              </p>
            </article>
            <article className="bg-brand-background rounded-xl p-5 space-y-2">
              <h2 className="text-base font-bold text-brand-dark">Cómo funciona</h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                Selecciona tu región y comuna. El sitio consulta los datos del MINSAL y te muestra
                las farmacias de turno con dirección, horario y enlace a Maps.
              </p>
            </article>
            <article className="bg-brand-background rounded-xl p-5 space-y-2">
              <h2 className="text-base font-bold text-brand-dark">Cobertura</h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                Comunas y ciudades de Chile con datos disponibles en la fuente oficial. La
                cobertura depende de lo que el MINSAL publica en su API pública.
              </p>
            </article>
          </div>

          {/* Transparencia de datos */}
          <div className="border-t border-brand-background pt-8 space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">
              Transparencia de datos
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Toda la información de farmacias de turno proviene de la{" "}
              <strong className="text-brand-dark font-medium">
                API pública del Ministerio de Salud de Chile (MINSAL)
              </strong>
              . FarmaciasHoy.cl no genera ni modifica estos datos; solo los presenta de forma
              más accesible para el usuario.
            </p>
            <p className="text-xs text-brand-muted">
              * La disponibilidad y horarios pueden cambiar sin aviso previo. Verifica siempre
              antes de trasladarte largas distancias.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href="mailto:farmaciashoy@gmail.com?subject=Correcci%C3%B3n%20de%20datos%20farmacia%20de%20turno"
                className="inline-flex justify-center items-center rounded-xl bg-brand-dark px-5 py-2.5 text-sm text-white font-medium hover:opacity-90 transition-opacity"
              >
                Reportar un error
              </a>
              <Link
                to="/contacto"
                className="inline-flex justify-center items-center rounded-xl border border-brand-dark/20 px-5 py-2.5 text-sm text-brand-dark font-medium hover:bg-brand-background transition-colors"
              >
                Ir a contacto
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

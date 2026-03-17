// src/pages/QuienesSomos.jsx
import { Link } from "react-router";

const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";

// ─── META ─────────────────────────────────────────────────────────────────────
export function meta() {
  return [
    { title: "¿Quiénes somos? | FarmaciasHoy.cl" },
    { name: "description", content: "Somos una plataforma gratuita para encontrar farmacias de turno en Chile. Datos oficiales del Ministerio de Salud (MINSAL)." },
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
              <li><Link to="/" className="hover:underline text-brand-background/80">Inicio</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="font-bold text-white">¿Quiénes somos?</li>
            </ol>
          </nav>
          <h1 className="text-2xl lg:text-4xl font-bold text-brand-background mb-2">
            ¿Quiénes somos?
          </h1>
          <p className="text-brand-background/90 text-sm md:text-base">
            Una plataforma sencilla y gratuita para encontrar la farmacia de turno más cercana en Chile.
          </p>
        </div>
      </div>

      {/* CONTENIDO */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 py-8 md:py-10 max-w-4xl space-y-10">

          {/* Intro + CTAs */}
          <div className="space-y-4">
            <p className="text-sm text-brand-muted leading-relaxed">
              Somos una plataforma sencilla y gratuita cuyo objetivo es ayudarte a encontrar{" "}
              <strong className="text-brand-dark font-medium">la farmacia de turno más cercana</strong>{" "}
              en tu ciudad o comuna, de forma rápida y confiable.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                to="/"
                className="inline-flex justify-center items-center rounded-xl bg-brand-dark px-5 py-2.5 text-sm text-white font-medium hover:opacity-90 transition-opacity"
              >
                Volver al inicio
              </Link>
              <Link
                to="/contacto"
                className="inline-flex justify-center items-center rounded-xl border border-brand-dark/20 px-5 py-2.5 text-sm text-brand-dark font-medium hover:bg-brand-background transition-colors"
              >
                Ir a contacto
              </Link>
            </div>
          </div>

          {/* Cards — misión, cómo funciona, cobertura */}
          <div className="grid md:grid-cols-3 gap-4">
            <article className="bg-brand-background rounded-xl p-5 space-y-2">
              <h2 className="text-base font-bold text-brand-dark">Nuestra misión</h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                Reducir el tiempo y la incertidumbre al buscar una farmacia de turno, entregando información clara, actualizada y fácil de leer desde tu teléfono o computador.
              </p>
            </article>
            <article className="bg-brand-background rounded-xl p-5 space-y-2">
              <h2 className="text-base font-bold text-brand-dark">Cómo funciona</h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                Selecciona tu región y comuna. Te mostramos las farmacias de turno con dirección, horario y un enlace para abrir la ubicación en Maps.
              </p>
            </article>
            <article className="bg-brand-background rounded-xl p-5 space-y-2">
              <h2 className="text-base font-bold text-brand-dark">Cobertura</h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                Comunas y ciudades de Chile con datos oficiales disponibles. Seguimos trabajando para mejorar la cobertura y la exactitud día a día.
              </p>
            </article>
          </div>

          {/* Transparencia de datos */}
          <div className="border-t border-brand-background pt-8 space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">Transparencia de datos</h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Los datos de{" "}
              <strong className="text-brand-dark font-medium">Farmacia de turno</strong>{" "}
              provienen del{" "}
              <strong className="text-brand-dark font-medium">Ministerio de Salud (MINSAL)</strong>.
              Si detectas información incorrecta o incompleta, por favor ponte en contacto con nosotros para corregirla.
            </p>
            <p className="text-xs text-brand-muted">
              * La disponibilidad y horarios pueden cambiar sin aviso. Verifica siempre antes de trasladarte largas distancias.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href="mailto:farmaciashoy@gmail.com?subject=Correcci%C3%B3n%20de%20datos%20farmacia%20de%20turno"
                className="inline-flex justify-center items-center rounded-xl bg-brand-dark px-5 py-2.5 text-sm text-white font-medium hover:opacity-90 transition-opacity"
              >
                Enviar correo
              </a>
              <Link
                to="/contacto"
                className="inline-flex justify-center items-center rounded-xl border border-brand-dark/20 px-5 py-2.5 text-sm text-brand-dark font-medium hover:bg-brand-background transition-colors"
              >
                Ir a contacto
              </Link>
            </div>
          </div>

          {/* Publicidad y diseño */}
          <div className="border-t border-brand-background pt-8 space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark">Publicidad y diseño web</h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Si te interesa aparecer en nuestra plataforma, promocionar tu marca o necesitas apoyo en{" "}
              <strong className="text-brand-dark font-medium">diseño y desarrollo web</strong>,
              escríbenos y conversemos.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href="mailto:farmaciashoy@gmail.com?subject=Publicidad%20o%20dise%C3%B1o%20web"
                className="inline-flex justify-center items-center rounded-xl bg-brand-dark px-5 py-2.5 text-sm text-white font-medium hover:opacity-90 transition-opacity"
              >
                Escribir por correo
              </a>
              <Link
                to="/contacto"
                className="inline-flex justify-center items-center rounded-xl border border-brand-dark/20 px-5 py-2.5 text-sm text-brand-dark font-medium hover:bg-brand-background transition-colors"
              >
                Página de contacto
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

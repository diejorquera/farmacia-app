// src/pages/Contacto.jsx
import { Link } from "react-router";

const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";
const EMAIL = "farmaciashoy@gmail.com";

// ─── META ─────────────────────────────────────────────────────────────────────
export function meta() {
  return [
    { title: "Contacto | FarmaciasHoy.cl" },
    { name: "description", content: "Contáctanos para corregir datos de farmacias de turno, consultar por publicidad o diseño web." },
    { tagName: "link", rel: "canonical", href: `${CANONICAL_ORIGIN}/contacto` },
  ];
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
export default function Contacto() {
  return (
    <div className="min-h-screen font-montserrat">

      {/* HERO */}
      <div className="min-h-[180px] md:min-h-[260px] bg-[url('/img/regionessm.webp')] md:bg-[url('/img/regionesmd.webp')] 2xl:bg-[url('/img/regioneslg.webp')] bg-cover bg-center bg-no-repeat flex flex-col justify-center py-3 md:py-5">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <nav className="text-sm text-brand-background mb-6" aria-label="Ruta de navegación">
            <ol className="flex items-center gap-2 list-none p-0 m-0">
              <li><Link to="/" className="hover:underline text-brand-background/80">Inicio</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="font-bold text-white">Contacto</li>
            </ol>
          </nav>
          <h1 className="text-2xl lg:text-4xl font-bold text-brand-background mb-2">
            Contacto
          </h1>
          <p className="text-brand-background/90 text-sm md:text-base">
            Corrección de datos, publicidad o desarrollo web — escríbenos directamente.
          </p>
        </div>
      </div>

 

      {/* SECCIÓN IMAGEN + TEXTO */}
      <section className="w-full bg-brand-background">
        <div className="container mx-auto px-4 py-10 md:py-14 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

            {/* Imagen */}
            <div className="rounded-2xl overflow-hidden">
              <img
                src="/img/contacto-farmturno.webp"
                alt="Interior de farmacia"
                className="w-full h-[260px] md:h-[380px] object-cover"
              />
            </div>

            {/* Texto */}
            <div className="space-y-5">
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark leading-snug">
                Estamos para ayudarte a encontrar tu farmacia de turno
              </h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                FarmaciasHoy.cl nació con un propósito simple: que cualquier persona en Chile pueda saber en segundos qué farmacia está abierta cerca de su casa, sin importar la hora ni el día.
              </p>
              <p className="text-sm text-brand-muted leading-relaxed">
                Los datos que publicamos provienen directamente del{" "}
                <strong className="text-brand-dark font-medium">Ministerio de Salud (MINSAL)</strong>{" "}
                y se actualizan diariamente. Si detectas algo incorrecto, tu reporte nos ayuda a mantener la información confiable para todos.
              </p>
              <p className="text-sm text-brand-muted leading-relaxed">
                También estamos abiertos a colaboraciones, publicidad y proyectos de diseño o desarrollo web. Escríbenos sin compromiso.
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark hover:underline"
              >
                {EMAIL}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>

          </div>
        </div>
      </section>
     {/* SECCIÓN EMAIL */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 py-8 md:py-10 max-w-4xl space-y-8">

          <div className="space-y-4">
            <p className="text-sm text-brand-muted leading-relaxed">
              Puedes escribirnos por cualquiera de estos motivos:
            </p>
            <div className="divide-y divide-brand-background rounded-xl border border-brand-background overflow-hidden">
              <div className="bg-white px-4 py-4">
                <p className="text-sm font-medium text-brand-dark">Corrección de datos</p>
                <p className="text-xs text-brand-muted mt-0.5">
                  Si encontraste información incorrecta sobre una farmacia de turno (fuente MINSAL).
                </p>
              </div>
              <div className="bg-white px-4 py-4">
                <p className="text-sm font-medium text-brand-dark">Publicidad</p>
                <p className="text-xs text-brand-muted mt-0.5">
                  Si quieres promocionar tu marca o aparecer en la plataforma.
                </p>
              </div>
              <div className="bg-white px-4 py-4">
                <p className="text-sm font-medium text-brand-dark">Diseño y desarrollo web</p>
                <p className="text-xs text-brand-muted mt-0.5">
                  Si necesitas apoyo para un proyecto digital.
                </p>
              </div>
            </div>
          </div>

          {/* Email CTA */}
          <div className="rounded-xl border border-brand-background bg-brand-background/40 p-5 space-y-3">
            <p className="text-xs uppercase tracking-wide text-brand-muted font-medium">
              Correo electrónico
            </p>
            <p className="text-lg font-medium text-brand-dark">{EMAIL}</p>
            <p className="text-xs text-brand-muted">
              Copia el correo o toca el botón para abrir tu app de email.
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-dark text-white text-sm font-medium px-5 py-2.5 hover:opacity-90 transition-opacity active:scale-95"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              Enviar email
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}

// src/pages/PoliticaPrivacidad.jsx
import { Link } from "react-router";

const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";
const EMAIL = "farmaciashoy@gmail.com";
const LAST_UPDATED = "17 de marzo de 2025";

// ─── META ─────────────────────────────────────────────────────────────────────
export function meta() {
  return [
    { title: "Política de Privacidad | FarmaciasHoy.cl" },
    { name: "description", content: "Política de privacidad de FarmaciasHoy.cl. Información sobre el uso de datos, cookies y publicidad en nuestra plataforma." },
    { tagName: "link", rel: "canonical", href: `${CANONICAL_ORIGIN}/politica-de-privacidad` },
  ];
}

// ─── SECCIÓN REUTILIZABLE ──────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="border-t border-brand-background pt-6 space-y-3">
      <h2 className="text-lg md:text-xl font-bold text-brand-dark">{title}</h2>
      <div className="text-sm text-brand-muted leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen bg-brand-background font-montserrat">

      {/* HERO */}
      <div className="min-h-[180px] md:min-h-[260px] bg-[url('/img/regionessm.webp')] md:bg-[url('/img/regionesmd.webp')] 2xl:bg-[url('/img/regioneslg.webp')] bg-cover bg-center bg-no-repeat flex flex-col justify-center py-3 md:py-5">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <nav className="text-sm text-brand-background mb-6" aria-label="Ruta de navegación">
            <ol className="flex items-center gap-2 list-none p-0 m-0">
              <li><Link to="/" className="hover:underline text-brand-background/80">Inicio</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="font-bold text-white">Política de Privacidad</li>
            </ol>
          </nav>
          <h1 className="text-2xl lg:text-4xl font-bold text-brand-background mb-2">
            Política de Privacidad
          </h1>
          <p className="text-brand-background/90 text-sm md:text-base">
            Última actualización: {LAST_UPDATED}
          </p>
        </div>
      </div>

      {/* CONTENIDO */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 py-8 md:py-10 max-w-3xl space-y-6">

          {/* Intro */}
          <p className="text-sm text-brand-muted leading-relaxed">
            En <strong className="text-brand-dark font-medium">FarmaciasHoy.cl</strong> nos
            comprometemos a proteger tu privacidad. Esta política explica qué información
            recopilamos, cómo la usamos y qué derechos tienes como usuario de nuestra plataforma.
          </p>

          <Section title="1. Responsable del sitio">
            <p>
              El sitio web <strong className="text-brand-dark font-medium">FarmaciasHoy.cl</strong>{" "}
              es operado de forma independiente con el propósito de facilitar el acceso a
              información pública sobre farmacias de turno en Chile.
            </p>
            <p>
              Para consultas relacionadas con esta política puedes escribirnos a{" "}
              <a href={`mailto:${EMAIL}`} className="text-brand-dark underline">{EMAIL}</a>.
            </p>
          </Section>

          <Section title="2. Información que recopilamos">
            <p>FarmaciasHoy.cl <strong className="text-brand-dark font-medium">no solicita ni almacena datos personales</strong> de sus usuarios. No es necesario registrarse ni crear una cuenta para usar la plataforma.</p>
            <p>Sin embargo, como cualquier sitio web, se recopila de forma automática información técnica no identificable, como:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Dirección IP (anonimizada)</li>
              <li>Tipo de navegador y dispositivo</li>
              <li>Páginas visitadas y tiempo de navegación</li>
              <li>País y región de acceso</li>
            </ul>
            <p>Esta información es recopilada exclusivamente mediante herramientas de analítica (Google Analytics) con fines estadísticos y de mejora del servicio.</p>
          </Section>

          <Section title="3. Uso de cookies">
            <p>
              Este sitio utiliza cookies para mejorar la experiencia de navegación y mostrar publicidad relevante. Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo.
            </p>
            <p>Utilizamos los siguientes tipos de cookies:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong className="text-brand-dark font-medium">Cookies técnicas:</strong> necesarias para el funcionamiento básico del sitio.</li>
              <li><strong className="text-brand-dark font-medium">Cookies analíticas:</strong> Google Analytics, para entender cómo los usuarios interactúan con el sitio.</li>
              <li><strong className="text-brand-dark font-medium">Cookies publicitarias:</strong> Google AdSense, para mostrar anuncios relevantes según tu navegación.</li>
            </ul>
            <p>
              Puedes desactivar las cookies desde la configuración de tu navegador, aunque esto puede afectar el funcionamiento de algunas funciones del sitio.
            </p>
          </Section>

          <Section title="4. Publicidad (Google AdSense)">
            <p>
              FarmaciasHoy.cl utiliza <strong className="text-brand-dark font-medium">Google AdSense</strong> para mostrar publicidad. Google puede usar cookies para personalizar los anuncios que ves según tu historial de navegación en otros sitios.
            </p>
            <p>
              Google, como proveedor externo, usa cookies para mostrar anuncios basados en visitas anteriores a este y otros sitios web. Puedes consultar y gestionar tus preferencias de publicidad personalizada en{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-dark underline"
              >
                google.com/settings/ads
              </a>.
            </p>
            <p>
              Para más información sobre cómo Google usa los datos, visita{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-dark underline"
              >
                policies.google.com/privacy
              </a>.
            </p>
          </Section>

          <Section title="5. Datos de farmacias (fuente MINSAL)">
            <p>
              La información sobre farmacias de turno que se muestra en este sitio proviene del{" "}
              <strong className="text-brand-dark font-medium">Ministerio de Salud de Chile (MINSAL)</strong>{" "}
              y es de carácter público. FarmaciasHoy.cl actúa como intermediario para facilitar su consulta, pero no es responsable de la exactitud, disponibilidad o actualización de dichos datos.
            </p>
            <p>
              Si detectas información incorrecta, puedes notificarnos a{" "}
              <a href={`mailto:${EMAIL}`} className="text-brand-dark underline">{EMAIL}</a> para
              gestionar la corrección.
            </p>
          </Section>

          <Section title="6. Servicios de terceros">
            <p>Este sitio puede integrar servicios de terceros que tienen sus propias políticas de privacidad:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                <strong className="text-brand-dark font-medium">Google Analytics</strong> —{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-dark underline">Ver política</a>
              </li>
              <li>
                <strong className="text-brand-dark font-medium">Google AdSense</strong> —{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-dark underline">Ver política</a>
              </li>
              <li>
                <strong className="text-brand-dark font-medium">Google Maps (embed)</strong> —{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-dark underline">Ver política</a>
              </li>
            </ul>
          </Section>

          <Section title="7. Derechos del usuario">
            <p>De acuerdo con la legislación chilena (Ley N° 19.628 sobre Protección de la Vida Privada) y el Reglamento General de Protección de Datos (GDPR) para usuarios de la Unión Europea, tienes derecho a:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Acceder a los datos que poseemos sobre ti</li>
              <li>Solicitar la rectificación o eliminación de tus datos</li>
              <li>Oponerte al tratamiento de tus datos con fines publicitarios</li>
            </ul>
            <p>
              Para ejercer estos derechos escríbenos a{" "}
              <a href={`mailto:${EMAIL}`} className="text-brand-dark underline">{EMAIL}</a>.
            </p>
          </Section>

          <Section title="8. Cambios en esta política">
            <p>
              Podemos actualizar esta política de privacidad en cualquier momento. La fecha de última actualización aparece al inicio de este documento. Te recomendamos revisarla periódicamente.
            </p>
          </Section>

          {/* CTA volver */}
          <div className="pt-4 pb-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-brand-dark hover:underline"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Volver al inicio
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

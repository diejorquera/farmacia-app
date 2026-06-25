// src/pages/PoliticaPrivacidad.jsx
import { Link } from "react-router";

const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";
const EMAIL = "farmaciashoy@gmail.com";
const LAST_UPDATED = "25 de junio de 2025";

// ─── META ─────────────────────────────────────────────────────────────────────
export function meta() {
  return [
    { title: "Política de Privacidad | FarmaciasHoy.cl" },
    {
      name: "description",
      content:
        "Política de privacidad de FarmaciasHoy.cl. Información sobre el uso de datos, cookies, publicidad de Google AdSense y derechos de los usuarios.",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: `${CANONICAL_ORIGIN}/politica-de-privacidad`,
    },
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
              <li>
                <Link to="/" className="hover:underline text-brand-background/80">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="font-bold text-white">
                Política de Privacidad
              </li>
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
            recopilamos, cómo la usamos, qué cookies utilizamos y cuáles son tus derechos como
            usuario de nuestra plataforma.
          </p>

          <Section title="1. Responsable del sitio">
            <p>
              El sitio web{" "}
              <strong className="text-brand-dark font-medium">FarmaciasHoy.cl</strong> es operado
              de forma independiente con el propósito de facilitar el acceso a información pública
              sobre farmacias de turno en Chile.
            </p>
            <p>
              Para consultas relacionadas con esta política puedes escribirnos a{" "}
              <a href={`mailto:${EMAIL}`} className="text-brand-dark underline">
                {EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="2. Información que recopilamos">
            <p>
              FarmaciasHoy.cl{" "}
              <strong className="text-brand-dark font-medium">
                no solicita ni almacena datos personales identificables
              </strong>{" "}
              de sus usuarios. No es necesario registrarse ni crear una cuenta para usar la
              plataforma.
            </p>
            <p>
              Sin embargo, como cualquier sitio web, se recopila de forma automática información
              técnica no identificable, como:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Dirección IP (procesada de forma automática por herramientas de analítica)</li>
              <li>Tipo de navegador y sistema operativo</li>
              <li>Dispositivo utilizado (escritorio, móvil, tablet)</li>
              <li>Páginas visitadas y tiempo de navegación</li>
              <li>País y región de acceso</li>
              <li>Fuente de tráfico (búsqueda orgánica, acceso directo, referidos)</li>
            </ul>
            <p>
              Esta información es recopilada exclusivamente mediante herramientas de analítica
              web (Google Analytics 4) con fines estadísticos y de mejora del servicio. No se
              utiliza para identificar a personas individuales.
            </p>
          </Section>

          <Section title="3. Base del tratamiento de datos">
            <p>
              El uso de datos técnicos no identificables se realiza con fines estadísticos y de
              mejora del servicio, conforme a buenas prácticas de privacidad y la legislación
              chilena aplicable (Ley N° 19.628 sobre Protección de la Vida Privada).
            </p>
            <p>
              Las cookies publicitarias utilizadas por Google AdSense pueden requerir consentimiento
              del usuario según su ubicación geográfica.
            </p>
          </Section>

          <Section title="4. Uso de cookies">
            <p>
              Este sitio utiliza cookies para mejorar la experiencia de navegación y mostrar
              publicidad. Las cookies son pequeños archivos de texto que se almacenan en tu
              dispositivo cuando visitas el sitio.
            </p>
            <p>Utilizamos los siguientes tipos de cookies:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                <strong className="text-brand-dark font-medium">Cookies técnicas / esenciales:</strong>{" "}
                necesarias para el funcionamiento básico del sitio. No requieren consentimiento.
              </li>
              <li>
                <strong className="text-brand-dark font-medium">Cookies analíticas:</strong> Google
                Analytics 4, para comprender cómo los usuarios interactúan con el sitio. Los datos
                se procesan de forma anonimizada.
              </li>
              <li>
                <strong className="text-brand-dark font-medium">Cookies publicitarias:</strong>{" "}
                Google AdSense, para mostrar anuncios relevantes según tu perfil de navegación.
                Estas cookies pueden recopilar datos sobre tu actividad en otros sitios web para
                personalizar los anuncios que ves.
              </li>
            </ul>
            <p>
              Puedes gestionar o desactivar las cookies desde la configuración de tu navegador en
              cualquier momento. Ten en cuenta que desactivarlas puede afectar la funcionalidad
              de algunas partes del sitio. Consulta la ayuda de tu navegador para instrucciones
              específicas:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-dark underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-dark underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-dark underline"
                >
                  Safari
                </a>
              </li>
            </ul>
          </Section>

          <Section title="5. Publicidad — Google AdSense">
            <p>
              FarmaciasHoy.cl utiliza{" "}
              <strong className="text-brand-dark font-medium">Google AdSense</strong> para mostrar
              publicidad. Google, como proveedor de publicidad externo, puede usar cookies y
              tecnologías similares (como identificadores de dispositivo) para mostrar anuncios
              basados en tus visitas anteriores a este y otros sitios web.
            </p>
            <p>
              <strong className="text-brand-dark font-medium">Publicidad personalizada:</strong> De
              forma predeterminada, Google AdSense puede mostrar anuncios personalizados según el
              historial de navegación del usuario. Puedes optar por publicidad no personalizada
              visitando{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-dark underline"
              >
                google.com/settings/ads
              </a>
              .
            </p>
            <p>
              <strong className="text-brand-dark font-medium">Opt-out adicional:</strong> También
              puedes optar por no recibir anuncios personalizados de proveedores de terceros
              visitando{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-dark underline"
              >
                aboutads.info/choices
              </a>{" "}
              o, si te encuentras en Europa,{" "}
              <a
                href="https://www.youronlinechoices.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-dark underline"
              >
                youronlinechoices.eu
              </a>
              .
            </p>
            <p>
              Para más información sobre cómo Google usa los datos de los socios que utilizan sus
              servicios, visita{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-dark underline"
              >
                policies.google.com/technologies/partner-sites
              </a>
              .
            </p>
          </Section>

          <Section title="6. Menores de edad">
            <p>
              FarmaciasHoy.cl no está dirigido a menores de 13 años. No recopilamos
              conscientemente información personal de niños o adolescentes menores de 13 años.
            </p>
            <p>
              Si eres padre, madre o tutor y crees que un menor ha proporcionado información
              personal a través de este sitio, contáctanos en{" "}
              <a href={`mailto:${EMAIL}`} className="text-brand-dark underline">
                {EMAIL}
              </a>{" "}
              para que podamos tomar las medidas correspondientes.
            </p>
          </Section>

          <Section title="7. Datos de farmacias (fuente MINSAL)">
            <p>
              La información sobre farmacias de turno que se muestra en este sitio proviene del{" "}
              <strong className="text-brand-dark font-medium">
                Ministerio de Salud de Chile (MINSAL)
              </strong>{" "}
              a través de su API pública. FarmaciasHoy.cl actúa como intermediario para facilitar
              su consulta, pero no es responsable de la exactitud, disponibilidad o actualización
              de dichos datos.
            </p>
            <p>
              Si detectas información incorrecta o desactualizada, puedes notificarnos a{" "}
              <a href={`mailto:${EMAIL}`} className="text-brand-dark underline">
                {EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="8. Servicios de terceros">
            <p>
              Este sitio integra servicios de terceros que operan bajo sus propias políticas de
              privacidad independientes:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                <strong className="text-brand-dark font-medium">Google Analytics 4</strong> —{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-dark underline"
                >
                  Ver política de privacidad
                </a>
              </li>
              <li>
                <strong className="text-brand-dark font-medium">Google AdSense</strong> —{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-dark underline"
                >
                  Ver política de privacidad
                </a>
              </li>
              <li>
                <strong className="text-brand-dark font-medium">Google Maps (embed)</strong> —{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-dark underline"
                >
                  Ver política de privacidad
                </a>
              </li>
            </ul>
            <p>
              FarmaciasHoy.cl no controla el comportamiento de estos terceros ni asume
              responsabilidad sobre sus prácticas de privacidad.
            </p>
          </Section>

<Section title="9. Seguridad">
            <p>
              Aplicamos medidas razonables para proteger la información recopilada a través del
              sitio. Sin embargo, ninguna transmisión de datos por internet es completamente segura.
            </p>
          </Section>

          <Section title="10. Derechos del usuario">
            <p>
              El usuario puede solicitar información o la eliminación de datos relacionados con su
              navegación escribiendo a{" "}
              <a href={`mailto:${EMAIL}`} className="text-brand-dark underline">
                {EMAIL}
              </a>
              . Atenderemos estas solicitudes conforme a la legislación chilena aplicable.
            </p>
          </Section>

          <Section title="11. Cambios en esta política">
            <p>
              Podemos actualizar esta política en cualquier momento. La fecha de última
              actualización aparece al inicio de este documento. Te recomendamos revisarla
              periódicamente.
            </p>
          </Section>

          {/* CTA volver */}
          <div className="pt-4 pb-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-brand-dark hover:underline"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Volver al inicio
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

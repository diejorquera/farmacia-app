import { Link } from "react-router-dom";

export default function QuienesSomos() {
  return (
    <div className="min-h-screen bg-brand-background text-brand-dark font-montserrat">
      {/* Hero */}
      <section className="container mx-auto px-4 py-14 max-w-5xl">
        <div className="bg-white/80 rounded-2xl shadow-2xl overflow-hidden border border-brand-dark/10">
          <div className="bg-gradient-to-r from-brand-dark to-brand-muted h-2" />
          <div className="p-8 md:p-12">
            <p className="uppercase tracking-widest text-sm text-brand-muted font-semibold">
              ¿Quiénes somos?
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold leading-tight">
              farmacia-de-turno.cl
            </h1>
            <p className="mt-4 text-brand-muted md:text-lg">
              Somos una plataforma sencilla y gratuita cuyo objetivo es ayudarte
              a encontrar{" "}
              <span className="font-semibold text-brand-dark">
                la farmacia de turno más cercana
              </span>{" "}
              en tu ciudad o comuna, de forma rápida y confiable.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg border border-brand-dark bg-brand-dark text-white hover:opacity-90 transition"
              >
                Volver al inicio
              </Link>
              <Link
                to="/contacto"
                className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg border border-brand-dark/30 text-brand-dark hover:border-brand-dark transition"
              >
                Ir a contacto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y cómo funciona */}
      <section className="container mx-auto px-4 pb-8 max-w-5xl grid md:grid-cols-3 gap-6">
        <article className="bg-white/80 rounded-xl border border-brand-dark/10 shadow-lg p-6">
          <h2 className="text-xl font-bold">Nuestra misión</h2>
          <p className="mt-2 text-brand-muted">
            Reducir el tiempo y la incertidumbre al buscar una farmacia de
            turno, entregando información clara, actualizada y fácil de leer
            desde tu teléfono o computador.
          </p>
        </article>

        <article className="bg-white/80 rounded-xl border border-brand-dark/10 shadow-lg p-6">
          <h2 className="text-xl font-bold">Cómo funciona</h2>
          <p className="mt-2 text-brand-muted">
            Ingresa el nombre de tu comuna o permite la geolocalización. Te
            mostramos las farmacias de turno más cercanas con dirección, horario
            y un enlace para abrir la ubicación en Maps.
          </p>
        </article>

        <article className="bg-white/80 rounded-xl border border-brand-dark/10 shadow-lg p-6">
          <h2 className="text-xl font-bold">Cobertura</h2>
          <p className="mt-2 text-brand-muted">
            Nuestro servicio apunta a comunas y ciudades de Chile con datos
            oficiales disponibles. Seguimos trabajando para mejorar la cobertura
            y la exactitud día a día.
          </p>
        </article>
      </section>

      {/* Fuente de datos y contacto */}
      <section className="container mx-auto px-4 pb-16 max-w-5xl">
        <div className="bg-white/80 rounded-2xl shadow-2xl overflow-hidden border border-brand-dark/10">
          <div className="bg-gradient-to-r from-brand-dark to-brand-muted h-2" />
          <div className="p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Transparencia de datos
            </h2>
            <p className="mt-3 text-brand-muted md:text-lg">
              Los datos de{" "}
              <span className="font-semibold text-brand-dark">
                Farmacia de turno
              </span>{" "}
              provienen del{" "}
              <span className="font-semibold">
                Ministerio de Salud (MINSAL)
              </span>
              . Si detectas información incorrecta o incompleta, por favor{" "}
              <span className="font-semibold text-brand-dark">
                ponte en contacto con nosotros
              </span>{" "}
              para corregirla.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:farmaciashoy@gmail.com?subject=Correcci%C3%B3n%20de%20datos%20farmacia%20de%20turno"
                className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg border border-brand-dark bg-brand-dark text-white hover:opacity-90 transition"
              >
                Enviar correo
              </a>
              <Link
                to="/contacto"
                className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg border border-brand-dark/30 text-brand-dark hover:border-brand-dark transition"
              >
                Ir a contacto
              </Link>
            </div>

            <div className="mt-6 text-sm text-brand-muted">
              <p>
                * La disponibilidad y horarios pueden cambiar sin aviso.
                Verifica siempre antes de trasladarte largas distancias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Publicidad y diseño web */}
      <section className="container mx-auto px-4 pb-20 max-w-5xl">
        <div className="bg-white/80 rounded-2xl shadow-2xl overflow-hidden border border-brand-dark/10">
          <div className="bg-gradient-to-r from-brand-dark to-brand-muted h-2" />
          <div className="p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Publicidad y diseño web
            </h2>
            <p className="mt-3 text-brand-muted md:text-lg">
              Si te interesa aparecer en nuestra plataforma, promocionar tu
              marca o necesitas apoyo en{" "}
              <span className="font-semibold text-brand-dark">
                diseño y desarrollo web
              </span>
              , escríbenos y conversemos. Puedes enviarnos un correo o ir a la
              página de contacto.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:farmaciashoy@gmail.com?subject=Publicidad%20o%20dise%C3%B1o%20web"
                className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg border border-brand-dark bg-brand-dark text-white hover:opacity-90 transition"
              >
                Escribir por correo
              </a>
              <Link
                to="/contacto"
                className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg border border-brand-dark/30 text-brand-dark hover:border-brand-dark transition"
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

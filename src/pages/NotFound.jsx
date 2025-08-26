import { Link } from "react-router-dom";
import errorImg from "../assets/error-404.png";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-background text-brand-dark font-montserrat flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        {/* Tarjeta */}
        <div className="bg-white/80 rounded-2xl shadow-2xl overflow-hidden border border-brand-dark/10">
          {/* Header visual */}
          <div className="bg-gradient-to-r from-brand-dark to-brand-muted h-2" />

          <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
            {/* Ilustración */}
            <div className="flex justify-center">
              <img
                src={errorImg}
                alt="Error 404"
                className="w-64 h-auto md:w-72 select-none"
                draggable="false"
              />
            </div>

            {/* Texto y acciones */}
            <div className="text-center md:text-left">
              <p className="uppercase tracking-widest text-sm text-brand-muted font-semibold">
                error 404
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold leading-tight">
                Página no encontrada
              </h1>
              <p className="mt-3 text-brand-muted">
                Lo sentimos, la ruta que buscaste no existe o fue movida. Vuelve
                al inicio para seguir navegando.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/"
                  className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg border border-brand-dark bg-brand-dark text-white hover:opacity-90 transition"
                >
                  Volver al inicio
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg border border-brand-dark/30 text-brand-dark hover:border-brand-dark transition"
                >
                  Ir atrás
                </button>
              </div>

              {/* Detalle útil */}
              <div className="mt-6 text-xs text-brand-muted">
                Código:{" "}
                <span className="font-semibold text-brand-dark">404</span> · Si
                crees que es un error,{" "}
                <a
                  href="mailto:soporte@tusitio.cl?subject=Reporte%20404"
                  className="underline hover:no-underline"
                >
                  contáctanos
                </a>
                .
              </div>
            </div>
          </div>
        </div>

        {/* link suave al home extra en mobile */}
        <div className="text-center mt-6 md:hidden">
          <Link to="/" className="text-sm underline text-brand-dark">
            o vuelve al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

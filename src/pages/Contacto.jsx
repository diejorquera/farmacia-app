// src/pages/Contacto.jsx
import { useState } from "react";
import { Link } from "react-router";

const CANONICAL_ORIGIN = "https://www.farmaciashoy.cl";

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
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "Corrección de datos (MINSAL)",
    mensaje: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Ingresa tu nombre.";
    if (!form.email.trim()) e.email = "Ingresa tu correo.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo no válido.";
    if (!form.mensaje.trim()) e.mensaje = "Cuéntanos brevemente tu solicitud.";
    return e;
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (form.honeypot) return;

    setSending(true);

    const to = "farmaciashoy@gmail.com";
    const subject = encodeURIComponent(`[Contacto] ${form.asunto}`);
    const body = encodeURIComponent(
      `Nombre: ${form.nombre}\nEmail: ${form.email}\nAsunto: ${form.asunto}\n\nMensaje:\n${form.mensaje}\n\n— Enviado desde farmacia-de-turno.cl`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

    setTimeout(() => setSending(false), 1200);
  };

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-brand-dark bg-white placeholder:text-brand-muted/50 outline-none transition-colors ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-brand-background focus:border-brand-dark"
    }`;

  return (
    <div className="min-h-screen font-montserrat">

      {/* HERO — consistente con RegionPage y ComunaPage */}
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
            Corrección de datos, publicidad o desarrollo web — escríbenos y te respondemos pronto.
          </p>
        </div>
      </div>

      {/* FORMULARIO */}
      <section className="w-full bg-white">
        <div className="container mx-auto px-4 py-8 md:py-10 max-w-2xl space-y-6">

          <p className="text-sm text-brand-muted leading-relaxed">
            Si encontraste datos incorrectos de una{" "}
            <strong className="text-brand-dark font-medium">farmacia de turno</strong>{" "}
            (fuente MINSAL), quieres consultar por{" "}
            <strong className="text-brand-dark font-medium">publicidad</strong>{" "}
            en la plataforma o necesitas{" "}
            <strong className="text-brand-dark font-medium">diseño o desarrollo web</strong>,
            completa el formulario.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Honeypot */}
            <input
              type="text"
              name="honeypot"
              value={form.honeypot}
              onChange={handleChange}
              className="sr-only"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-xs uppercase tracking-wide text-brand-muted mb-1.5">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className={inputClass("nombre")}
              />
              {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wide text-brand-muted mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@correo.cl"
                className={inputClass("email")}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Asunto */}
            <div>
              <label htmlFor="asunto" className="block text-xs uppercase tracking-wide text-brand-muted mb-1.5">
                Asunto
              </label>
              <select
                id="asunto"
                name="asunto"
                value={form.asunto}
                onChange={handleChange}
                className="w-full rounded-xl border border-brand-background px-4 py-3 text-sm text-brand-dark bg-white outline-none focus:border-brand-dark transition-colors"
              >
                <option>Corrección de datos (MINSAL)</option>
                <option>Publicidad en la plataforma</option>
                <option>Diseño / desarrollo web</option>
                <option>Otro</option>
              </select>
            </div>

            {/* Mensaje */}
            <div>
              <label htmlFor="mensaje" className="block text-xs uppercase tracking-wide text-brand-muted mb-1.5">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={5}
                value={form.mensaje}
                onChange={handleChange}
                placeholder="Cuéntanos brevemente tu solicitud…"
                className={inputClass("mensaje")}
              />
              {errors.mensaje && <p className="mt-1 text-xs text-red-500">{errors.mensaje}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-xl bg-brand-dark text-white font-medium text-sm py-3 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Abriendo cliente de correo…" : "Enviar mensaje"}
            </button>

          </form>
        </div>
      </section>

    </div>
  );
}

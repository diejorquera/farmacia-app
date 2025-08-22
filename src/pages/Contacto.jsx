import { useState } from "react";
import { Link } from "react-router-dom";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "Corrección de datos (MINSAL)",
    mensaje: "",
    honeypot: "", // anti-spam
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
    if (form.honeypot) return; // bot detected

    setSending(true);

    // Construye mailto
    const to = "contacto@farmacia-de-turno.cl";
    const subject = encodeURIComponent(`[Contacto] ${form.asunto}`);
    const body = encodeURIComponent(
      `Nombre: ${form.nombre}\nEmail: ${form.email}\nAsunto: ${form.asunto}\n\nMensaje:\n${form.mensaje}\n\n— Enviado desde farmacia-de-turno.cl`
    );
    const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;

    // Abre el cliente de correo
    window.location.href = mailtoUrl;

    // Feedback visual (por si el cliente de correo no se abre)
    setTimeout(() => setSending(false), 1200);
  };

  return (
    <div className="min-h-screen bg-brand-background text-brand-dark font-montserrat">
      {/* Hero / Encabezado */}
      <section className="container mx-auto px-4 pt-12 pb-6 max-w-4xl">
        <div className="bg-white/80 rounded-2xl shadow-2xl overflow-hidden border border-brand-dark/10">
          <div className="bg-gradient-to-r from-brand-dark to-brand-muted h-2" />
          <div className="p-8 md:p-10">
            <p className="uppercase tracking-widest text-sm text-brand-muted font-semibold">
              Contacto
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold leading-tight">
              ¿Hablemos?
            </h1>
            <p className="mt-3 text-brand-muted md:text-lg">
              Si encontraste datos incorrectos de una <span className="font-semibold text-brand-dark">farmacia de turno</span> (fuente MINSAL),
              quieres consultar por <span className="font-semibold text-brand-dark">publicidad</span> en la plataforma
              o necesitas <span className="font-semibold text-brand-dark">diseño/desarrollo web</span>, escríbenos y te responderemos pronto.
            </p>
            <div className="mt-4 text-sm text-brand-muted">
              También puedes escribir directamente a{" "}
              <a href="mailto:contacto@farmacia-de-turno.cl" className="underline">
                contacto@farmacia-de-turno.cl
              </a>
              .
            </div>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="container mx-auto px-4 pb-16 max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 rounded-2xl shadow-2xl overflow-hidden border border-brand-dark/10"
          noValidate
        >
          <div className="bg-gradient-to-r from-brand-dark to-brand-muted h-2" />
          <div className="p-8 md:p-10 grid grid-cols-1 gap-6">
            {/* Honeypot */}
            <input
              type="text"
              name="honeypot"
              value={form.honeypot}
              onChange={handleChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <label className="block text-sm font-semibold mb-2">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className={`w-full rounded-lg border p-3 outline-none bg-white/90 ${
                  errors.nombre ? "border-red-500" : "border-brand-dark/30 focus:border-brand-dark"
                }`}
                placeholder="Tu nombre"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full rounded-lg border p-3 outline-none bg-white/90 ${
                  errors.email ? "border-red-500" : "border-brand-dark/30 focus:border-brand-dark"
                }`}
                placeholder="tucorreo@dominio.cl"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Asunto</label>
              <select
                name="asunto"
                value={form.asunto}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none bg-white/90 border-brand-dark/30 focus:border-brand-dark"
              >
                <option>Corrección de datos (MINSAL)</option>
                <option>Publicidad en farmacia-de-turno.cl</option>
                <option>Consulta de diseño/desarrollo web</option>
                <option>Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Mensaje</label>
              <textarea
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                rows={6}
                className={`w-full rounded-lg border p-3 outline-none bg-white/90 resize-y ${
                  errors.mensaje ? "border-red-500" : "border-brand-dark/30 focus:border-brand-dark"
                }`}
                placeholder="Cuéntanos tu consulta con el mayor detalle posible…"
              />
              {errors.mensaje && (
                <p className="mt-1 text-sm text-red-600">{errors.mensaje}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs text-brand-muted">
                * Usamos tu información solo para responder tu consulta.
              </p>
              <button
                type="submit"
                disabled={sending}
                className={`inline-flex justify-center items-center px-5 py-2.5 rounded-lg border transition
                  ${sending
                    ? "border-brand-dark/30 bg-brand-dark/40 text-white cursor-not-allowed"
                    : "border-brand-dark bg-brand-dark text-white hover:opacity-90"
                  }`}
              >
                {sending ? "Abriendo tu correo…" : "Enviar mensaje"}
              </button>
            </div>
          </div>
        </form>

        {/* Enlaces rápidos */}
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <Link
            to="/"
            className="text-center px-4 py-3 rounded-lg border border-brand-dark/30 text-brand-dark hover:border-brand-dark transition bg-white/70"
          >
            ← Volver al inicio
          </Link>
          <a
            href="mailto:contacto@farmacia-de-turno.cl?subject=Publicidad%20o%20dise%C3%B1o%20web"
            className="text-center px-4 py-3 rounded-lg border border-brand-dark text-white bg-brand-dark hover:opacity-90 transition"
          >
            Publicidad / Diseño web
          </a>
          <Link
            to="/quienes-somos"
            className="text-center px-4 py-3 rounded-lg border border-brand-dark/30 text-brand-dark hover:border-brand-dark transition bg-white/70"
          >
            Conoce más sobre nosotros
          </Link>
        </div>
      </section>
    </div>
  );
}

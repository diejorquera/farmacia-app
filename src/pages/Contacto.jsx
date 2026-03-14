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

  return (
    <div className="min-h-screen bg-brand-background text-brand-dark font-montserrat">
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
              Si encontraste datos incorrectos de una{" "}
              <span className="font-semibold text-brand-dark">farmacia de turno</span>{" "}
              (fuente MINSAL), quieres consultar por{" "}
              <span className="font-semibold text-brand-dark">publicidad</span>{" "}
              en la plataforma o necesitas{" "}
              <span className="font-semibold text-brand-dark">diseño/desarrollo web</span>,
              escríbenos y te responderemos pronto.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

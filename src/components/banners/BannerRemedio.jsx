import { BannerCard } from "./BannerBase";

// A. Favorita: "Esto tiene remedio" encaja con el contexto de farmacia.
export function BannerRemedio({ className }) {
  return (
    <BannerCard
      campaign="remedio"
      titulo={
        <>
          ¿Nadie encuentra tu negocio en Google? <strong>Esto tiene remedio.</strong>
        </>
      }
      bajada={
        <>
          Tu página web lista en <strong>días</strong>, con precio cerrado.
        </>
      }
      boton="Quiero aparecer"
      tema="verde"
      className={className}
    />
  );
}

import { BannerBarra } from "./BannerBase";

// 7. Versiones ultracortas 320x50 (barra fija móvil). Una por mensaje.
export function BannerMovilPrecio({ className }) {
  return (
    <BannerBarra
      campaign="movil-precio"
      texto="Tu web por $100.000"
      className={className}
    />
  );
}

export function BannerMovilEncontraron({ className }) {
  return (
    <BannerBarra
      campaign="movil-te-encontraron"
      texto="¿Te encontraron en Google? Tu negocio también puede"
      className={className}
    />
  );
}

export function BannerMovilTienda({ className }) {
  return (
    <BannerBarra
      campaign="movil-tienda"
      texto="Tienda online: $179.000"
      className={className}
    />
  );
}

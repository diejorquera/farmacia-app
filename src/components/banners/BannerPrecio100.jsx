import { BannerCard } from "./BannerBase";

// B. Precio directo con llamado a la oferta. One Page: $100.000 (antes $125.000).
export function BannerPrecio100({ className }) {
  return (
    <BannerCard
      campaign="precio-100000"
      etiqueta="Oferta"
      precioAntes="$125.000"
      titulo={
        <>
          Aprovecha la oferta: tu página web por <strong>$100.000</strong>
        </>
      }
      bajada={
        <>
          <strong>Dominio y hosting del primer año incluidos.</strong> Precio cerrado, sin letra chica.
        </>
      }
      boton="Aprovechar oferta"
      tema="oferta"
      className={className}
    />
  );
}

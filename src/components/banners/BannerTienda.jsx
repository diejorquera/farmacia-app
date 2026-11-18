import { BannerCard } from "./BannerBase";

// 4. Tienda virtual con carrito: $179.000 (antes $199.000).
export function BannerTienda({ className }) {
  return (
    <BannerCard
      campaign="tienda-virtual"
      titulo={
        <>
          Tus clientes ya compran por internet. <strong>¿Y tú?</strong>
        </>
      }
      bajada={
        <>
          Ten tu tienda virtual por <strong>$179.000</strong>.
        </>
      }
      boton="Ver plan Tienda"
      tema="claro"
      className={className}
    />
  );
}

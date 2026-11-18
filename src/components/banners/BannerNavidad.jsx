import { BannerCard } from "./BannerBase";

// 5. Navidad. Con 5 a 15 días hábiles de entrega, el pedido debe hacerse
// antes del 1 de diciembre. Retirar después de esa fecha.
export function BannerNavidad({ className }) {
  return (
    <BannerCard
      campaign="navidad"
      titulo={
        <>
          Esta Navidad, <strong>que tus clientes te encuentren</strong>
        </>
      }
      bajada={
        <>
          Página web desde <strong>$100.000</strong>. <strong>Pide antes del 1 de diciembre.</strong>
        </>
      }
      boton="Reservar mi web"
      tema="verde"
      className={className}
    />
  );
}

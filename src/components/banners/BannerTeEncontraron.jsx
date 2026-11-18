import { BannerCard } from "./BannerBase";

// D. Favorita: el visitante acaba de comprobar que aparecer en Google funciona.
export function BannerTeEncontraron({ className }) {
  return (
    <BannerCard
      campaign="te-encontraron"
      titulo={
        <>
          Tú nos encontraste en Google. <strong>¿Tus clientes te encuentran a ti?</strong>
        </>
      }
      bajada={
        <>
          Ten tu página web desde <strong>$100.000</strong>.
        </>
      }
      boton="Quiero aparecer"
      className={className}
    />
  );
}

import { BannerCard } from "./BannerBase";

// 2. Juego con "farmacia de turno": encaja con el tema del sitio.
export function BannerDeTurno({ className }) {
  return (
    <BannerCard
      campaign="de-turno-24-7"
      titulo={
        <>
          Tu negocio también puede estar de turno <strong>24/7</strong>
        </>
      }
      bajada={
        <>
          Una página web que <strong>atiende aunque tú estés cerrado.</strong>
        </>
      }
      boton="Quiero mi web"
      className={className}
    />
  );
}

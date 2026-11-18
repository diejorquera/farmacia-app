import { BannerCard } from "./BannerBase";

// C. Black Friday (viernes 27 de noviembre de 2026).
// OJO: la entrega toma 5 a 15 días hábiles, así que NO prometer "lista para
// Black Friday". Este texto solo dice "todavía estás a tiempo" con el plan más
// rápido. Retirar o cambiar después del 27 de noviembre.
export function BannerBlackFriday({ className }) {
  return (
    <BannerCard
      campaign="blackfriday"
      etiqueta="Black Friday"
      titulo={
        <>
          ¿Llegas a Black Friday <strong>sin página web?</strong>
        </>
      }
      bajada={
        <>
          Todavía estás a tiempo: desde <strong>$100.000</strong>.
        </>
      }
      boton="Empezar hoy"
      className={className}
    />
  );
}

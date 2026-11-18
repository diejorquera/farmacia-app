// Vista previa SOLO para elegir. No está enlazada a ninguna ruta.
// Para verla en local, importa <BannersPreview /> temporalmente en una página
// (y quítalo antes de commitear). Se puede borrar cuando se elija el banner.
import {
  BannerTeEncontraron,
  BannerRemedio,
  BannerPrecio100,
  BannerBlackFriday,
  BannerTienda,
  BannerNavidad,
  BannerDeTurno,
  BannerMovilPrecio,
  BannerMovilEncontraron,
  BannerMovilTienda,
} from "./index";

const TARJETAS = [
  { nombre: "D. Tú nos encontraste en Google (favorita)", Banner: BannerTeEncontraron },
  { nombre: "A. Esto tiene remedio (favorita)", Banner: BannerRemedio },
  { nombre: "B. Tu página web por $100.000", Banner: BannerPrecio100 },
  { nombre: "C. Black Friday (hasta el 27 nov)", Banner: BannerBlackFriday },
  { nombre: "4. Tienda virtual", Banner: BannerTienda },
  { nombre: "5. Navidad (pedir antes del 1 dic)", Banner: BannerNavidad },
  { nombre: "2. De turno 24/7", Banner: BannerDeTurno },
];

const BARRAS = [
  { nombre: "Móvil · precio", Banner: BannerMovilPrecio },
  { nombre: "Móvil · te encontraron", Banner: BannerMovilEncontraron },
  { nombre: "Móvil · tienda", Banner: BannerMovilTienda },
];

function Grupo({ titulo, items }) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-brand-dark">{titulo}</h2>
      {items.map((item) => (
        <div key={item.nombre}>
          <p className="text-xs text-brand-muted mb-1">{item.nombre}</p>
          <item.Banner />
        </div>
      ))}
    </section>
  );
}

export default function BannersPreview() {
  return (
    <div className="font-montserrat max-w-3xl mx-auto p-4 space-y-8 bg-brand-background">
      <Grupo titulo="Banners tarjeta" items={TARJETAS} />
      <Grupo titulo="Barras móviles 320×50" items={BARRAS} />
    </div>
  );
}

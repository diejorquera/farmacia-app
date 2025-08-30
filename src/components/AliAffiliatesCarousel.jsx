import { useEffect, useRef, useState } from "react";

export default function AliAffiliatesCarousel() {
  const scrollerRef = useRef(null);
  const pausedRef = useRef(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Ajustes
  const SHOW_GRADIENTS = false;     // ← cámbialo a true si quieres volver a verlos
  const AUTO_PLAY = true;           // ← autoplay activado
  const AUTO_DELAY = 2800;          // ms entre desplazamientos
  const AUTO_STEP_CARDS = 2;        // cuántas tarjetas avanza por “tick”
  const GAP_PX = 16;                // equivalente a gap-4

  const items = [
    // 4 iniciales
    { href: "https://s.click.aliexpress.com/e/_oEOR8hj", src: "https://ae01.alicdn.com/kf/Sf16d0c2d422448b69c401d0943e173e7P.jpg_140x140.jpg", alt: "Producto AliExpress 1" },
    { href: "https://s.click.aliexpress.com/e/_oEVsSPf", src: "https://ae01.alicdn.com/kf/S9362a37f40564b3aa8d57e3b1ce9fa15d.jpg_140x140.jpg", alt: "Producto AliExpress 2" },
    { href: "https://s.click.aliexpress.com/e/_onovurf", src: "https://ae01.alicdn.com/kf/S3337fe819fce4a4184b1fbda0115ac1eB.jpg_140x140.jpg", alt: "Producto AliExpress 3" },
    { href: "https://s.click.aliexpress.com/e/_omODdqt", src: "https://ae01.alicdn.com/kf/Sb95c4973728042ea942c45a7175a9d41a.png_140x140.png", alt: "Producto AliExpress 4" },
    // 5 nuevos
    { href: "https://s.click.aliexpress.com/e/_oD2239r", src: "https://ae01.alicdn.com/kf/Sbc2eb701a1c246bd967fd2231e46cc250.jpg_140x140.jpg", alt: "Producto AliExpress 5" },
    { href: "https://s.click.aliexpress.com/e/_olTYGxf", src: "https://ae01.alicdn.com/kf/Sde097a2d49d047deacdf999180298f5eX.jpg_140x140.jpg", alt: "Producto AliExpress 6" },
    { href: "https://s.click.aliexpress.com/e/_oDMbgA9", src: "https://ae01.alicdn.com/kf/S7d7d045777614b47bdd9213a3592912fu.jpg_140x140.jpg", alt: "Producto AliExpress 7" },
    { href: "https://s.click.aliexpress.com/e/_oEDu3C9", src: "https://ae01.alicdn.com/kf/S2a9bf0681816406085033507868ca219P.png_140x140.png", alt: "Producto AliExpress 8" },
    { href: "https://s.click.aliexpress.com/e/_oEdgqnf", src: "https://ae01.alicdn.com/kf/S6867854d79754c27bdd318c6e9028b15C.jpg_140x140.jpg", alt: "Producto AliExpress 9" },
  ];

  const updateEdges = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft <= 1);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  };

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => updateEdges();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateEdges);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateEdges);
    };
  }, []);

  const scrollByCards = (dir = 1, stepCards = 3) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const cardW = card ? card.getBoundingClientRect().width : el.clientWidth;
    el.scrollBy({ left: dir * (cardW * stepCards + GAP_PX * (stepCards - 1)), behavior: "smooth" });
  };

  const autoAdvance = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const nearEnd = scrollLeft + clientWidth >= scrollWidth - 2;
    if (nearEnd) {
      // vuelve al inicio
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      scrollByCards(1, AUTO_STEP_CARDS);
    }
  };

  // Autoplay (respeta reduce motion y pausa en hover / pestaña oculta)
  useEffect(() => {
    if (!AUTO_PLAY) return;
    const el = scrollerRef.current;
    if (!el) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    const tick = () => {
      if (!pausedRef.current && document.visibilityState === "visible") {
        autoAdvance();
      }
    };
    const id = setInterval(tick, AUTO_DELAY);

    const onVisibility = () => {
      // si vuelve a visible, actualiza edges por si cambió el layout
      if (document.visibilityState === "visible") updateEdges();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [AUTO_PLAY, AUTO_DELAY]);

  return (
    <section aria-labelledby="productos-aliexpress" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <h2 id="productos-aliexpress" className="text-base font-semibold text-gray-900 mb-3">
          Ofertas recomendadas
        </h2>

        <div
          className="relative"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          {/* Prev */}
          <button
            type="button"
            onClick={() => scrollByCards(-1, 3)}
            disabled={atStart}
            aria-label="Productos anteriores"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border bg-white shadow ring-1 ring-black/5 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.78 15.53a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 1 1 1.06 1.06L9.06 10l3.72 3.72a.75.75 0 0 1 0 1.06z" />
            </svg>
          </button>

          {/* Carrusel */}
          <ul
            ref={scrollerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 py-2 px-1
                       [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="list"
            aria-label="Carrusel de productos de AliExpress"
          >
            {items.map((it, i) => (
              <li key={i} className="snap-start shrink-0" data-card>
                <a
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="group block w-[150px] sm:w-[170px] md:w-[190px] lg:w-[200px]"
                  aria-label={`Ver oferta ${i + 1}`}
                >
                  <div className="relative pt-[100%] overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                    <img
                      src={it.src}
                      alt={it.alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="pointer-events-none absolute bottom-1 left-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium shadow-sm opacity-0 group-hover:opacity-100 transition">
                      Ver oferta
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {/* Next */}
          <button
            type="button"
            onClick={() => scrollByCards(1, 3)}
            disabled={atEnd}
            aria-label="Productos siguientes"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border bg-white shadow ring-1 ring-black/5 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.22 4.47a.75.75 0 0 1 1.06 0L12.53 8.7a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L10.94 10 7.22 6.28a.75.75 0 0 1 0-1.06z" />
            </svg>
          </button>

          {/* Gradientes laterales (desactivados) */}
          {SHOW_GRADIENTS && !atStart && (
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-white/0" />
          )}
          {SHOW_GRADIENTS && !atEnd && (
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-white/0" />
          )}
        </div>

        <p className="mt-3 text-[9px] text-gray-500">* URLs son enlaces de afiliado.</p>
      </div>
    </section>
  );
}

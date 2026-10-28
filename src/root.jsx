import "./index.css";
import { useEffect, useState } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import AdBanner from "./components/AdBanner";
import { usePageViews } from "./hooks/usePageViews";

const MOBILE_AD_KEY = "2f2ea7e891280c5266fe3fd4bad994a1";
const MOBILE_AD_CLOSED_FLAG = "adBannerClosed";

function AppLayout() {
  usePageViews();
  const [showMobileAd, setShowMobileAd] = useState(false);

  useEffect(() => {
    try {
      setShowMobileAd(sessionStorage.getItem(MOBILE_AD_CLOSED_FLAG) !== "1");
    } catch {
      setShowMobileAd(true);
    }
  }, []);

  const closeMobileAd = () => {
    setShowMobileAd(false);
    try {
      sessionStorage.setItem(MOBILE_AD_CLOSED_FLAG, "1");
    } catch {
      /* sessionStorage no disponible (modo privado, etc.): no persiste, no bloquea */
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className={`flex-1 w-full ${showMobileAd ? "pb-[66px] md:pb-0" : ""}`}>
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />

      {showMobileAd && (
        <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-brand-background">
          <div className="relative flex items-center justify-center py-2">
            <AdBanner type="banner" adKey={MOBILE_AD_KEY} width={320} height={50} />
            <button
              type="button"
              onClick={closeMobileAd}
              aria-label="Cerrar anuncio"
              className="absolute -top-2 right-2 w-6 h-6 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center shadow"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Root() {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="google-site-verification"
          content="--25RmkNiKV5zoHD2Qk0NaMnRHeeuHzfgHfuwRm2Ero"
        />
        <link
          rel="icon"
          href="/img/favicon-light.png"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          href="/img/favicon-dark.png"
          media="(prefers-color-scheme: light)"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <AppLayout />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
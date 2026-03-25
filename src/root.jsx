import "./index.css";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { usePageViews } from "./hooks/usePageViews";
import { useEffect } from "react"; // 👈 IMPORTANTE: agregar este import

function AppLayout() {
  usePageViews();
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 w-full">
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function Root() {
  // 👈 Cargar AdSense después del montaje de React
  useEffect(() => {
    // Verificar si el script ya existe para no duplicarlo
    const existingScript = document.querySelector('script[src*="adsbygoogle"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1146285560546460';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      console.log('AdSense script cargado correctamente');
    }
  }, []); // El array vacío asegura que solo se ejecute una vez

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
        {/* 👈 EL SCRIPT DE ADSENSE HA SIDO ELIMINADO DE AQUÍ */}
      </head>
      <body>
        <AppLayout />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
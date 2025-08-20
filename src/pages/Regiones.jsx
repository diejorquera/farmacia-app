import { RegionesGrid } from '../components/RegionesGrid.jsx';
export default function Regiones() {
  return (
    <section>
<div className="min-h-screen bg-white text-brand-dark antialiased font-montserrat">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        <main className="py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
          <RegionesGrid />
        </main>
      </div>
    </div>
    </section>
  );
}

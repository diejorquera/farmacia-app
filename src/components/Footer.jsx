export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Farmacias de Turno.</p>
        <p className="text-gray-500">
          Datos referenciales. Verifica antes de desplazarte.
        </p>
      </div>
    </footer>
  );
}

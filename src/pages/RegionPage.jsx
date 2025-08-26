import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { slugToRegion } from "../data/regiones";
import { getTurnosPorRegion, getComunasPorRegion } from "../services/farmacias";
import { FarmaciaCard } from "../components/FarmaciaCard";

export default function RegionPage() {
  const { slug } = useParams();
  const region = slugToRegion[slug];

  const [state, setState] = useState({ loading: true, error: null, items: [] });
  const [comunas, setComunas] = useState([]);
  const [comuna, setComuna] = useState(""); // filtro <select>
  const [q, setQ] = useState(""); // filtro texto

  // SEO básico (SPA)
  useEffect(() => {
    if (!region) return;
    document.title = `Farmacias de turno en ${region.nombre} | Farmacias-de-turno.cl`;
    const id = "canonical-link";
    let link = document.querySelector(`link[data-id="${id}"]`);
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      link.setAttribute("data-id", id);
      document.head.appendChild(link);
    }
    link.href = `https://farmacias-de-turno.cl/regiones/${region.slug}`;
  }, [region]);

  // Cargar datos + comunas
  useEffect(() => {
    let alive = true;
    async function load() {
      if (!region) return;
      setState({ loading: true, error: null, items: [] });
      setComunas([]);
      setComuna("");
      setQ("");

      try {
        const [raw, listaComunas] = await Promise.all([
          getTurnosPorRegion(region.id_api),
          getComunasPorRegion(region.id_api),
        ]);
        if (alive) {
          setState({ loading: false, error: null, items: raw });
          setComunas(listaComunas);
        }
      } catch (_) {
        if (alive) {
          setState({
            loading: false,
            error: "No se pudo cargar la información",
            items: [],
          });
          setComunas([]);
        }
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [region]);

  // Filtros: por comuna (select) y por texto (nombre/local/comuna)
  const itemsFiltrados = useMemo(() => {
    let arr = state.items;
    if (comuna) {
      arr = arr.filter(
        (f) =>
          (f.comuna_nombre ?? f.comuna ?? "").toLowerCase() ===
          comuna.toLowerCase()
      );
    }
    const term = q.trim().toLowerCase();
    if (term) {
      arr = arr.filter(
        (f) =>
          (f.comuna_nombre ?? f.comuna ?? "").toLowerCase().includes(term) ||
          (f.local_nombre ?? "").toLowerCase().includes(term) ||
          (f.local_direccion ?? "").toLowerCase().includes(term)
      );
    }
    return arr;
  }, [state.items, comuna, q]);

  const limpiarFiltros = () => {
    setComuna("");
    setQ("");
  };

  if (!region) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="mb-4">Región no encontrada.</p>
        <Link to="/regiones" className="underline">
          Volver al listado
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-brand-muted">
        <Link to="/" className="hover:underline">
          Inicio
        </Link>{" "}
        <span>›</span>{" "}
        <Link to="/regiones" className="hover:underline">
          Regiones
        </Link>{" "}
        <span>›</span> <span className="font-bold">{region.nombre}</span>
      </nav>

      {/* Encabezado */}
      <header className="space-y-2">
        <h1 className="text-2xl lg:text-5xl font-bold mb-4 text-brand-dark">
          Farmacias de turno en {region.nombre}
        </h1>
        <p className="text-brand-muted">
          Resultados informados por MINSAL para esta región. Filtra por comuna o
          busca por nombre.
        </p>
      </header>

      {/* Filtros */}
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
        <div className="w-full md:w-64">
          <label className="block text-sm font-medium mb-1 text-">Comuna</label>
          <select
            className="w-full border  border-brand-dark rounded-md px-3 py-2 bg-white"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            disabled={state.loading || !!state.error}
          >
            <option value="">Todas</option>
            {comunas.map((c) => (
              <option value={c} key={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:max-w-sm">
          <label className="block text-sm font-medium mb-1">Buscar</label>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ej: Talca, Providencia..."
            className="w-full border border-brand-dark rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-muted "
            disabled={state.loading || !!state.error}
          />
        </div>

        <button
          type="button"
          onClick={limpiarFiltros}
          className="md:mt-auto md:self-center bg-brand-dark font-semibold text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-muted transition-colors"
          disabled={state.loading || (!!state.error && !q && !comuna)}
          title="Limpiar filtros"
        >
          Limpiar filtros
        </button>
      </section>

      {/* Estado / conteo */}
      {!state.loading && !state.error && (
        <p className="text-sm text-gray-600">
          {itemsFiltrados.length} resultado
          {itemsFiltrados.length !== 1 ? "s" : ""}
          {comuna ? ` en ${comuna}` : ""}.
        </p>
      )}

      {/* Contenido */}
      {state.loading && (
        <div className="grid gap-6 ">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border rounded-md p-4 bg-brand-background shadow-2xl animate-pulse"
            >
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-48 w-full bg-gray-200 rounded mt-4" />
            </div>
          ))}
        </div>
      )}

      {state.error && <p className="text-red-600">{state.error}</p>}

      {!state.loading &&
        !state.error &&
        (itemsFiltrados.length ? (
          <div className="grid gap-2 md:grid-cols-2">
            {itemsFiltrados.map((farmacia) => (
              <FarmaciaCard
                key={
                  farmacia.local_id ||
                  farmacia.id_local ||
                  `${farmacia.local_nombre}|${farmacia.local_direccion}`
                }
                farmacia={farmacia}
              />
            ))}
          </div>
        ) : (
          <p>
            No hay resultados{q && ` para “${q}”`}
            {comuna && ` en ${comuna}`}.
          </p>
        ))}
    </main>
  );
}

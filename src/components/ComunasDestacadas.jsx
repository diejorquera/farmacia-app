import { Link } from "react-router-dom";

const COMUNAS_POPULARES = [
  { nombre: "Arica",        regionSlug: "arica-y-parinacota",        comunaSlug: "farmacia-turno-arica" },
  { nombre: "Iquique",      regionSlug: "tarapaca",                  comunaSlug: "farmacia-turno-iquique" },
  { nombre: "Antofagasta",  regionSlug: "antofagasta",               comunaSlug: "farmacia-turno-antofagasta" },
  { nombre: "Copiapó",      regionSlug: "atacama",                   comunaSlug: "farmacia-turno-copiapo" },
  { nombre: "La Serena",    regionSlug: "coquimbo",                  comunaSlug: "farmacia-turno-la-serena" },
  { nombre: "Valparaíso",   regionSlug: "valparaiso",                comunaSlug: "farmacia-turno-valparaiso" },
  { nombre: "Rancagua",     regionSlug: "ohiggins",                  comunaSlug: "farmacia-turno-rancagua" },
  { nombre: "Talca",        regionSlug: "maule",                     comunaSlug: "farmacia-turno-talca" },
  { nombre: "Concepción",   regionSlug: "biobio",                    comunaSlug: "farmacia-turno-concepcion" },
  { nombre: "Temuco",       regionSlug: "la-araucania",              comunaSlug: "farmacia-turno-temuco" },
  { nombre: "Valdivia",     regionSlug: "los-rios",                  comunaSlug: "farmacia-turno-valdivia" },
  { nombre: "Puerto Montt", regionSlug: "los-lagos",                 comunaSlug: "farmacia-turno-puerto-montt" },
  { nombre: "Santiago",     regionSlug: "metropolitana-de-santiago", comunaSlug: "farmacia-turno-santiago" },
  { nombre: "Puente Alto",  regionSlug: "metropolitana-de-santiago", comunaSlug: "farmacia-turno-puente-alto" },
  { nombre: "Maipú",        regionSlug: "metropolitana-de-santiago", comunaSlug: "farmacia-turno-maipu" },
  { nombre: "Las Condes",   regionSlug: "metropolitana-de-santiago", comunaSlug: "farmacia-turno-las-condes" },
  { nombre: "San Bernardo", regionSlug: "metropolitana-de-santiago", comunaSlug: "farmacia-turno-san-bernardo" },
  { nombre: "La Florida",   regionSlug: "metropolitana-de-santiago", comunaSlug: "farmacia-turno-la-florida" },
];

export function ComunasDestacadas() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl py-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted mb-3">
        Comunas más buscadas
      </p>
      <div className="flex flex-wrap gap-2">
        {COMUNAS_POPULARES.map((c) => (
          <Link
            key={c.comunaSlug}
            to={`/regiones/${c.regionSlug}/${c.comunaSlug}`}
            className="text-sm font-medium text-brand-muted bg-white border border-brand-muted/25 px-3 py-1.5 rounded-full hover:border-brand-dark hover:text-brand-dark transition-colors"
          >
            {c.nombre}
          </Link>
        ))}
      </div>
    </div>
  );
}
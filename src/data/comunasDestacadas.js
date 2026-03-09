// src/data/comunasDestacadas.js
import { COMUNAS_CHILE } from "./comunas.js";

const COMUNAS_MAP = new Map(COMUNAS_CHILE.map((c) => [c.id, c]));

const COMUNAS_DESTACADAS = {
  1:  ["1"],                         // Solo hay Arica con datos
  2:  ["9", "5", "11", "10"],        // Iquique, Alto Hospicio, Pozo Almonte, Pica
  3:  ["12", "13", "20", "17"],      // Antofagasta, Calama, Tocopilla, San Pedro de Atacama
  4:  ["24", "29", "22", "25"],      // Copiapó, Vallenar, Caldera, Diego de Almagro
  5:  ["36", "33", "39", "34"],      // La Serena, Coquimbo, Ovalle, Illapel
  6:  ["78", "80", "73", "70"],      // Valparaíso, Viña del Mar, San Antonio, Quilpué
  7:  ["119", "107", "124", "90"],   // Puente Alto, Maipú, San Bernardo, El Bosque
  8:  ["162", "165", "158", "163"],  // Rancagua, San Fernando, Pichilemu, Rengo
  9:  ["194", "174", "178", "181"],  // Talca, Curicó, Linares, Molina
  10: ["210", "220", "244", "212"],  // Concepción, Los Ángeles, Talcahuano, Coronel
  11: ["275", "268", "251", "281"],  // Temuco, Padre Las Casas, Angol, Villarrica
  12: ["290", "284", "291", "293"],  // Valdivia, La Unión, Panguipulli, Río Bueno
  13: ["311", "309", "296", "313"],  // Puerto Montt, Osorno, Castro, Puerto Varas
  14: ["328", "325", "327", "324"],  // Coyhaique, Chile Chico, Cochrane, Aysén
  15: ["339", "338"],                // Punta Arenas, Puerto Natales (solo 2 en los datos)
  16: ["205", "235", "201", "209"],  // Chillán, San Carlos, Bulnes, Coihueco
};

function toSlug(nombre) {
  return "farmacia-turno-" +
    nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
}

export function getComunasDestacadas(regionId) {
  return (COMUNAS_DESTACADAS[regionId] ?? [])
    .map((id) => COMUNAS_MAP.get(id))
    .filter(Boolean)
    .map((c) => ({ nombre: c.nombre, slug: toSlug(c.nombre) }));
}
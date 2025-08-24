// Normaliza: minúsculas + sin tildes + trim
const normalize = (s) =>
  (s ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// Canonicaliza: solo letras/números + 1 espacio entre palabras
const canonicalize = (s) =>
  normalize(s)
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Extrae términos autorizados buscando FRASES completas (1..N palabras).
 * - authorizedList: array de strings (ej. ["Talca", "San Fernando", ...])
 * - Devuelve { matches: [{raw, startIndex, words}], chosen }
 *   Prioriza: más palabras; si empata, aparece antes en la consulta.
 */
export function extractAuthorizedTerms(query, authorizedList) {
  const cq = canonicalize(query);
  if (!cq || !Array.isArray(authorizedList) || authorizedList.length === 0) {
    return { matches: [], chosen: null };
  }

  // Mapa de "frase canónica" -> "raw original"
  const map = new Map();
  let maxWords = 1;
  for (const raw of authorizedList) {
    const c = canonicalize(raw);
    if (!c) continue;
    map.set(c, raw);
    const wc = c.split(" ").length;
    if (wc > maxWords) maxWords = wc;
  }

  const tokens = cq.split(" "); // consulta ya canonicalizada
  const hits = [];

  // Ventana deslizante: probamos frases de maxWords..1
  for (let win = Math.min(maxWords, tokens.length); win >= 1; win--) {
    for (let i = 0; i + win <= tokens.length; i++) {
      const phrase = tokens.slice(i, i + win).join(" ");
      if (map.has(phrase)) {
        hits.push({
          raw: map.get(phrase),       // ej. "San Fernando"
          startIndex: i,              // posición en la consulta
          words: win,                 // nº palabras de la frase
          canonical: phrase,          // "san fernando"
        });
      }
    }
    // Si ya encontramos algo con esta ventana (más grande),
    // no hace falta seguir con ventanas más chicas para priorizar por más palabras.
    if (hits.length) break;
  }

  if (!hits.length) return { matches: [], chosen: null };

  // Si hay múltiples con igual nº de palabras, prioriza la que aparece antes.
  hits.sort((a, b) => a.startIndex - b.startIndex);

  return { matches: hits, chosen: hits[0].raw };
}

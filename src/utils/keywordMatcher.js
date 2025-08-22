// Normaliza: quita tildes, pasa a minúsculas y recorta
const normalize = (s) =>
  (s ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

/**
 * Extrae coincidencias exactas por palabra respecto a la lista autorizada.
 * - query: string de entrada libre del usuario
 * - authorizedList: array de strings (ej. nombres de comunas)
 * Retorna { matches: [...], chosen: string|null }
 */
export function extractAuthorizedTerms(query, authorizedList) {
  if (!query || !authorizedList?.length) return { matches: [], chosen: null };

  // Tokeniza palabras (incluye caracteres acentuados)
  const tokens = (query.match(/[A-Za-zÀ-ÿ]+/g) || []).map((raw, i) => ({
    raw,
    norm: normalize(raw),
    idx: i,
  }));

  // Autorizadas con su versión normalizada
  const auth = authorizedList.map((raw) => ({ raw, norm: normalize(raw) }));

  // Coincidencias exactas por token (norm)
  const hits = [];
  for (const tk of tokens) {
    const found = auth.find((a) => a.norm === tk.norm);
    if (found) {
      hits.push({
        tokenIndex: tk.idx,
        tokenRaw: tk.raw,
        authRaw: found.raw,
        authNorm: found.norm,
      });
    }
  }

  if (!hits.length) return { matches: [], chosen: null };

  // Prioriza: (1) más largo; (2) si empata, el que aparece antes
  hits.sort((a, b) => {
    const len = b.authRaw.length - a.authRaw.length;
    return len !== 0 ? len : a.tokenIndex - b.tokenIndex;
  });

  return { matches: hits, chosen: hits[0].authRaw };
}

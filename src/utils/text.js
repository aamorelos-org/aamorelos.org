/**
 * Normaliza texto para comparaciones: minúsculas, sin acentos/diacríticos y sin espacios extremos.
 * @param value Texto fuente.
 * @return Texto normalizado.
 */
export function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/**
 * Indica si [value] contiene [query] tras normalizar ambos. Sin [query] siempre es true.
 * @param value Texto buscado.
 * @param query Consulta del usuario.
 * @return true si hay coincidencia.
 */
export function matchesQuery(value, query) {
  if (!query) {
    return true
  }

  return normalizeText(value).includes(normalizeText(query))
}

/**
 * Indica si algún campo del registro contiene [query] tras normalizar. Omite las claves
 * `image`/`imagen` y los valores nulos; objeto sueltos se serializan. Sin [query] siempre es true.
 * @param record Registro a evaluar.
 * @param query Consulta del usuario.
 * @return true si algún valor coincide.
 */
export function matchesRecord(record, query) {
  if (!query) {
    return true
  }

  const haystack = Object.entries(record ?? {})
    .filter(([key]) => !['image', 'imagen'].includes(key.toLowerCase()))
    .map(([, value]) => {
      if (value == null) {
        return ''
      }
      return typeof value === 'object' ? JSON.stringify(value) : String(value)
    })
    .join(' ')

  return matchesQuery(haystack, query)
}

/**
 * Convierte un texto a slug `[a-z0-9_]`: minúsculas, sin acentos, caracteres especiales
 * a `_`, `_` repetidos se colapsan y se recorta en los extremos.
 * @param value Texto fuente.
 * @return Slug sin guiones bajos en los extremos.
 */
export function toSlug(value) {
  const cleaned = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/_{2,}/g, '_')
  let start = 0
  let end = cleaned.length
  while (start < end && cleaned.charAt(start) === '_') start += 1
  while (end > start && cleaned.charAt(end - 1) === '_') end -= 1
  return cleaned.slice(start, end)
}

/**
 * Devuelve un `tel:` con código de país: 10 dígitos mexicanos reciben `+52`,
 * el resto se prefija `+`. Devuelve '' si no hay dígitos.
 * @param value Teléfono en cualquier formato.
 * @return URL de teléfono.
 */
export function formatPhoneHref(value = '') {
  const digits = String(value).replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  return digits.length === 10 ? `+52${digits}` : `+${digits}`
}

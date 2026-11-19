const EXTERNAL_URL = /^https?:\/\//i

/**
 * Indica si la URL es externa (empieza con http:// o https://).
 * @param url URL a evaluar.
 * @return true si la URL es externa.
 */
export function isExternal(url = '') {
  return EXTERNAL_URL.test(url.trim())
}

/**
 * Resuelve la ruta de un asset: externas pasan «as-is»; las relativas quedan
 * prefijadas con / sin barras duplicadas; vacío → cadena vacía.
 * @param path Ruta relativa o URL absoluta.
 * @return URL lista para el navegador.
 */
export function assetUrl(path = '') {
  const value = String(path || '').trim()

  if (!value) {
    return ''
  }

  if (isExternal(value)) {
    return value
  }

  return `/${value.replace(/^\/+/, '')}`
}

/**
 * Resuelve la ruta de imagen de un registro: acepta el ítem mismo o su propiedad
 * imagen; vacío o ausente → cadena vacía.
 * @param item Ítem crudo de la API o URL.
 * @return URL lista para el navegador.
 */
export function mediaUrl(item) {
  if (!item) {
    return ''
  }

  if (typeof item === 'string') {
    return assetUrl(item)
  }

  const image = String(item.imagen || '').trim()

  return assetUrl(image)
}

/**
 * Extrae el slug/archivo final de una URL legada (sin ? ni fragmento, sin .php).
 * Vacío, # o URL externa → sin valor (cadena vacía).
 * @param value URL legada (detalle_grupo.php?id=34, /pages/eventos/32_semana, etc.).
 * @return El segmento de archivo sin extensión.
 */
export function slugFromUrl(value = '') {
  const raw = String(value || '').trim()

  if (!raw || raw === '#' || isExternal(raw)) {
    return ''
  }

  const path = raw.split(/[?#]/)[0].replace(/^\/+/, '')
  const file = path.split('/').pop() || ''

  return file.replace(/\.php.*$/i, '')
}

/**
 * Resuelve el enlace de un evento: la url viene con layout legado; si no existe,
 * construye la ruta española interna desde su slogan.
 * @param event Ítem crudo de la API.
 * @return Destino {to, external} listo para el router.
 */
export function eventLink(event) {
  const url = String(event?.url || '').trim()

  if (url) {
    return legacyToRoute(url)
  }

  if (event?.slogan) {
    return {
      to: event.tipo === 'invitacion'
        ? `/pages/eventos/${event.slogan}.php`
        : `/pages/eventos/${event.slogan}`,
      external: false,
    }
  }

  return { to: '#', external: false }
}

/**
 * Resuelve la ruta de la reflexión: prefiere el slug extraído de url o el
 * slogan propio; sin ambos usa el id legado.
 * @param reflection Reflexión cruda de la API.
 * @return Ruta interna.
 */
export function reflectionRoute(reflection) {
  if (!reflection) {
    return '/#reflexiones'
  }

  const slug = slugFromUrl(reflection.url) || reflection.slogan

  if (slug) {
    return `/pages/reflexiones/${slug}`
  }

  return `/pages/reflexiones/detalle_reflexion.php?id=${reflection.id}`
}

/**
 * Traduce una URL legada de la API a ruta SPA. Externas y # se preservan;
 * index.php apunta a la portada.
 * @param url URL legada.
 * @return Destino {to, external} listo para el router.
 */
export function legacyToRoute(url = '') {
  const value = String(url || '').trim()

  if (!value || value === '#') {
    return { to: '#', external: false }
  }

  if (isExternal(value)) {
    return { to: value, external: true }
  }

  const clean = value.replace(/^\/+/, '')

  if (clean === 'index.php') {
    return { to: '/', external: false }
  }

  return { to: `/${clean}`, external: false }
}

/**
 * Ruta interna de detalle de comité.
 * @param id Id del comité.
 * @return Ruta interna.
 */
export function committeeRoute(id) {
  return `/pages/comites/detalle_comite.php?id=${id}`
}

/**
 * Ruta interna de detalle de grupo.
 * @param id Id del grupo.
 * @return Ruta interna.
 */
export function groupRoute(id) {
  return `/pages/grupos/detalle_grupo.php?id=${encodeURIComponent(id)}`
}

/**
 * Ruta interna de detalle de distrito.
 * @param id Id del distrito.
 * @return Ruta interna.
 */
export function districtRoute(id) {
  return `/pages/distritos/detalle_distrito.php?id=${encodeURIComponent(id)}`
}

/**
 * URL de embed de Google Maps con zoom 15 para la consulta indicada.
 * @param query Consulta de búsqueda (dirección, grupo, distrito…).
 * @return URL de embed.
 */
export function mapsEmbedUrl(query) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`
}

const EXTERNAL_URL = /^https?:\/\//i

export function isExternal(url = '') {
  return EXTERNAL_URL.test(url.trim())
}

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

export function slugFromUrl(value = '') {
  const raw = String(value || '').trim()

  if (!raw || raw === '#' || isExternal(raw)) {
    return ''
  }

  const path = raw.split(/[?#]/)[0].replace(/^\/+/, '')
  const file = path.split('/').pop() || ''

  return file.replace(/\.php.*$/i, '')
}

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

export function committeeRoute(id) {
  return `/pages/comites/detalle_comite.php?id=${id}`
}

export function groupRoute(id) {
  return `/pages/grupos/detalle_grupo.php?id=${encodeURIComponent(id)}`
}

export function districtRoute(id) {
  return `/pages/distritos/detalle_distrito.php?id=${encodeURIComponent(id)}`
}

export function mapsEmbedUrl(query) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`
}

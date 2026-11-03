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

export function reflectionRoute(reflection) {
  if (!reflection) {
    return '/#reflexiones'
  }

  if (reflection.slug) {
    return `/pages/reflections/${reflection.slug}`
  }

  return `/pages/reflections/detalle_reflexion.php?id=${reflection.id}`
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

  if (clean.startsWith('pages/reflections/')) {
    const fileName = clean.split('/').pop() || ''
    const slug = fileName.replace(/\.php.*$/i, '')
    return { to: `/pages/reflections/${slug}`, external: false }
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

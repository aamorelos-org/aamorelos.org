export function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function matchesQuery(value, query) {
  if (!query) {
    return true
  }

  return normalizeText(value).includes(normalizeText(query))
}

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

export function toSlug(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_{2,}/g, '_')
}

export function formatPhoneHref(value = '') {
  const digits = String(value).replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  return digits.length === 10 ? `+52${digits}` : `+${digits}`
}

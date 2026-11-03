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

export function formatPhoneHref(value = '') {
  const digits = String(value).replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  return digits.length === 10 ? `+52${digits}` : `+${digits}`
}

export function extractList(response) {
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response)) return response

  if (response?.ok === false) {
    throw new Error(response.message || response.error || 'La API rechazó la solicitud.')
  }

  return []
}

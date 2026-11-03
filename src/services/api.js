import { committees } from '../data/committees'

const rawBaseUrl = import.meta.env?.VITE_API_URL || 'https://aamorelos.onrender.com'
const API_URL = rawBaseUrl.replace(/\/+$/, '')

export const isApiConfigured = Boolean(API_URL)

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = `Error ${response.status} al consultar la API`

    try {
      const errorData = await response.json()
      message = errorData?.message || errorData?.error || message
    } catch {
      // Si la API no envía JSON, se conserva el mensaje por estado HTTP.
    }

    throw new Error(message)
  }

  return response.json()
}

function listFrom(response) {
  if (Array.isArray(response?.data)) {
    return response.data
  }
  return Array.isArray(response) ? response : []
}

export const api = {
  async getStateDistricts(stateId = '17') {
    return request(`/aa/api/v1/states/${encodeURIComponent(stateId)}/districts`)
  },

  async getAreaDistricts(areaId) {
    return request(`/aa/api/v1/areas/${encodeURIComponent(areaId)}/districts`)
  },

  async getDistrictGroups(districtId) {
    return request(`/aa/api/v1/districts/${encodeURIComponent(districtId)}/groups`)
  },

  async getStateGroups(stateId = '17') {
    return request(`/aa/api/v1/states/${encodeURIComponent(stateId)}/groups`)
  },

  async getDistrictDetail(districtId, stateId = '17') {
    const response = await this.getStateDistricts(stateId)
    return listFrom(response).find((district) => String(district.id) === String(districtId)) || null
  },

  async getGroupDetail(groupId, stateId = '17') {
    const response = await this.getStateGroups(stateId)
    return listFrom(response).find((group) => String(group.id) === String(groupId)) || null
  },

  async getReflections() {
    return request('/aa/api/v1/reflections/')
  },

  async getReflectionDetail(slugOrId) {
    const response = await this.getReflections()
    const value = String(slugOrId || '').replace(/\.php$/i, '')
    return (
      listFrom(response).find((reflection) => {
        if (reflection.slug === value) {
          return true
        }
        return String(reflection.id) === value
      }) || null
    )
  },

  async createReflection(payload) {
    const token = sessionStorage.getItem('access_token')

    if (!token) {
      throw new Error('Sesión no válida. Inicia sesión nuevamente.')
    }

    return request('/aa/api/v1/reflections/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  },

  async getEvents() {
    return request('/aa/api/v1/events/')
  },

  async getEventDetail(slugOrId) {
    const value = String(slugOrId || '').replace(/\.php$/i, '')

    if (/^\d+$/.test(value)) {
      const response = await request(`/aa/api/v1/events/${encodeURIComponent(value)}`)
      return response?.data || null
    }

    const response = await this.getEvents()
    const event = listFrom(response).find((item) => item.slug === value)

    if (!event) {
      return null
    }

    const detail = await request(`/aa/api/v1/events/${encodeURIComponent(event.id)}`)
    return detail?.data || null
  },

  async getCommittees() {
    return committees
  },

  async getHealth() {
    return request('/health')
  },
}

export { API_URL }

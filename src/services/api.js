import { committees } from '../data/committees'
import { slugFromUrl } from '../utils/links'

const rawBaseUrl = import.meta.env?.VITE_API_URL || 'https://aamorelos.onrender.com'
const API_URL = rawBaseUrl.replace(/\/+$/, '')

export const isApiConfigured = Boolean(API_URL)

function messageFromErrorData(errorData, status) {
  if (typeof errorData?.message === 'string' && errorData.message.trim()) {
    return errorData.message
  }

  if (typeof errorData?.error === 'string' && errorData.error.trim()) {
    return errorData.error
  }

  // FastAPI/Pydantic: {detail: "..."} o {detail: [{loc, msg, type}, ...]}
  const detail = errorData?.detail

  if (typeof detail === 'string' && detail.trim()) {
    return detail
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === 'string') return item

        const field = Array.isArray(item?.loc)
          ? item.loc.filter((part) => part !== 'body').join('.')
          : ''
        const raw = String(item?.msg || '').replace(/^Value error,\s*/i, '')

        if (!raw) return ''
        return field ? `${field}: ${raw}` : raw
      })
      .filter(Boolean)

    if (messages.length) {
      return messages.join(' · ')
    }
  }

  return `Error ${status} al consultar la API`
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    let errorData = null

    try {
      errorData = await response.json()
    } catch {
      // Si la API no envía JSON, se conserva el mensaje por estado HTTP.
    }

    throw new Error(messageFromErrorData(errorData, response.status))
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
    return request(`/aa/api/v1/estados/${encodeURIComponent(stateId)}/distritos`)
  },

  async getAreaDistricts(areaId) {
    return request(`/aa/api/v1/areas/${encodeURIComponent(areaId)}/distritos`)
  },

  async getDistrictGroups(districtId) {
    return request(`/aa/api/v1/distritos/${encodeURIComponent(districtId)}/grupos`)
  },

  async getStateGroups(stateId = '17') {
    return request(`/aa/api/v1/estados/${encodeURIComponent(stateId)}/grupos`)
  },

  async getDistrictDetail(districtId, stateId = '17') {
    return request(`/aa/api/v1/distritos/${encodeURIComponent(districtId)}`)
  },

  async getGroupDetail(groupId, stateId = '17') {
    return request(`/aa/api/v1/estados/${encodeURIComponent(stateId)}/grupos/${encodeURIComponent(groupId)}`)
  },

  async getReflections({ skip = 0, limit = 100 } = {}) {
    const params = new URLSearchParams({ skip, limit })
    return request(`/aa/api/v1/reflexiones/?${params.toString()}`)
  },

  async getReflectionDetail(slugOrId) {
    const value = slugFromUrl(slugOrId)

    if (!value) {
      return null
    }

    const response = await request(`/aa/api/v1/reflexiones/${encodeURIComponent(value)}`)
    return response?.data || null
  },

  async createReflection(payload) {
    const token = sessionStorage.getItem('access_token')

    if (!token) {
      throw new Error('Sesión no válida. Inicia sesión nuevamente.')
    }

    return request('/aa/api/v1/reflexiones/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  },

  async getEvents({ skip = 0, limit = 100 } = {}) {
    const params = new URLSearchParams({ skip, limit })
    return request(`/aa/api/v1/eventos/?${params.toString()}`)
  },

  async getGroups() {
    return request(`/aa/api/v1/estados/17/grupos`)
  },

  async getDirectorio() {
    return request('/aa/api/v1/directorio/')
  },

  async getEventDetail(slugOrId) {
    const value = slugFromUrl(slugOrId)

    if (!value) {
      return null
    }

    if (/^\d+$/.test(value)) {
      const response = await request(`/aa/api/v1/eventos/${encodeURIComponent(value)}`)
      return response?.data || null
    }

    const response = await this.getEvents({ skip: 0, limit: 500 })
    const event = listFrom(response).find(
      (item) => slugFromUrl(item.url) === value || item.slogan === value,
    )

    if (!event) {
      return null
    }

    const detail = await request(`/aa/api/v1/eventos/${encodeURIComponent(event.id)}`)
    return detail?.data || null
  },

  async createEvent(payload) {
    const token = sessionStorage.getItem('access_token')

    if (!token) {
      throw new Error('Sesión no válida. Inicia sesión nuevamente.')
    }

    return request('/aa/api/v1/eventos/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  },

  async getCommittees() {
    return committees
  },

  async getHealth() {
    return request('/health')
  },
}

export { API_URL }

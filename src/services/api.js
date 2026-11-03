import districtsData from '../data/districts.json'
import committeesData from '../data/committees.json'
import reflectionsData from '../data/reflections.json'
import eventsData from '../data/events.json'
import { eventDetails } from '../data/eventDetails'
import { invitationBlocks, invitationDays } from '../data/invitation'

const rawBaseUrl = import.meta.env.VITE_API_URL || 'https://aamorelos.onrender.com'
const API_URL = rawBaseUrl.replace(/\/+$/, '')

const FORCE_LOCAL_MOCK = false
export const isApiConfigured = Boolean(API_URL) && !FORCE_LOCAL_MOCK

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status} al consultar la API`)
  }

  return response.json()
}

export const api = {
  async getStateDistricts(stateId = '17') {
    return request(`/aa/api/v1/states/${encodeURIComponent(stateId)}/districts`).catch(async () => {
      await delay()
      return districtsData
    })
  },

  async getAreaDistricts(areaId) {
    return request(`/aa/api/v1/areas/${encodeURIComponent(areaId)}/districts`).catch(async () => {
      await delay()
      return districtsData.filter((d) => String(d.area_id) === String(areaId))
    })
  },

  async getDistrictGroups(districtId) {
    return request(`/aa/api/v1/districts/${encodeURIComponent(districtId)}/groups`).catch(async () => {
      await delay()
      const data = districtsData.filter((g) => String(g.district_id) === String(districtId))
      return {
        ok: true,
        district_id: String(districtId),
        total_registros: data.length,
        data,
      }
    })
  },

  async getStateGroups(stateId = '17') {
    return request(`/aa/api/v1/states/${encodeURIComponent(stateId)}/groups`).catch(async () => {
      await delay()
      return {
        ok: true,
        state_id: String(stateId),
        total_registros: 0,
        data: [],
      }
    })
  },

  async getReflections() {
    return request('/aa/api/v1/reflections').catch(async () => {
      await delay()
      return reflectionsData
    })
  },

  async getEvents() {
    return request('/aa/api/v1/events').catch(async () => {
      await delay()
      return eventsData
    })
  },

  async getEventDetail(slug) {
    const cleanSlug = String(slug || '').replace(/\.php$/i, '')
    return request(`/aa/api/v1/events/${encodeURIComponent(cleanSlug)}`).catch(async () => {
      await delay()
      if (cleanSlug === 'invitacion_37178') {
        return {
          ok: true,
          tipo: 'invitacion',
          slug: 'invitacion_37178',
          url: 'pages/eventos/invitacion_37178.php',
          title: '16° Aniversario - Hoy volvemos a empezar',
          subtitle: 'Atenta invitación · Grupo Hoy Volvemos a Empezar',
          image: 'images/aniversarios/grupo_37178/invitacion.jpg',
          alt: 'Cartel oficial del 16 Aniversario del Grupo Hoy Volvemos a Empezar',
          footer: 'Central Mexicana de Servicios Generales de A.A., A.C. · 6° Distrito · Área Morelos',
          epigrafe: 'Central Mexicana de Servicios Generales de A.A., A.C. · 6° Distrito · Área Morelos',
          kicker: 'Atenta invitación',
          frase_reflexion: '«La verdad puede compararse con una piedra preciosa. Si la lanzamos contra el rostro de alguien, puede herir; pero si la envolvemos en un delicado papel y la ofrecemos con ternura, ciertamente será aceptada con agrado.»',
          resumen_fechas: {
            dias_unidad: 'Del 8 al 19 de diciembre de 2026',
            junta_publica: 'Domingo 20 de diciembre · 12:00 hrs',
            sede: 'Explanada del grupo',
          },
          contacto: {
            nombre: 'Ana Lilia',
            telefono: '777 497 32 33',
            telefono_href: '+527774973233',
          },
          bloques_itinerario: invitationBlocks.map((b) => ({
            ...b,
            dias: invitationDays.filter((d) => d.block === b.id),
          })),
        }
      }
      return eventDetails[cleanSlug] || null
    })
  },

  async getCommittees() {
    await delay()
    return committeesData
  },

  async getHealth() {
    return request('/health').catch(async () => {
      await delay()
      return { status: 'healthy', mode: 'mock-local' }
    })
  },
}

export { API_URL }

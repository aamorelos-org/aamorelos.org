import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { api, isApiConfigured } from './api'
import { committees } from '../data/committees'

const jsonResponse = (data, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: async () => data,
})

const fetchMock = () => globalThis.fetch

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('api: espacio de nombres y base URL', () => {
  it('expone isApiConfigured como truthy por defecto', () => {
    expect(isApiConfigured).toBe(true)
  })

  it('getHealth llama a /health sin prefijo API', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ status: 'ok' }))
    await api.getHealth()
    expect(fetchMock()).toHaveBeenCalledWith(
      'https://api.aamorelos.org/health',
      expect.anything(),
    )
  })
})

describe('api: endpoints públicos', () => {
  it('getEvents pasa skip y limit en el query string', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: [] }))
    await api.getEvents({ skip: 10, limit: 25 })
    const url = fetchMock().mock.calls[0][0]
    expect(url).toContain('skip=10')
    expect(url).toContain('limit=25')
  })

  it('getReflections aplica defaults skip=0 limit=100', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: [] }))
    await api.getReflections()
    const url = fetchMock().mock.calls[0][0]
    expect(url).toContain('skip=0')
    expect(url).toContain('limit=100')
  })

  it('getCuestionario consulta /cuestionario', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: [] }))
    await api.getCuestionario()
    expect(fetchMock().mock.calls[0][0]).toBe(
      'https://api.aamorelos.org/aa/api/v1/cuestionario',
    )
  })

  it('getCommittees devuelve el catálogo estático', async () => {
    const result = await api.getCommittees()
    expect(result).toBe(committees)
  })

  it('getReflectionDetail(slug) devuelve el contenido de envelope.data', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: { titulo: 'X' } }))
    const result = await api.getReflectionDetail('mi_slug')
    expect(result).toEqual({ titulo: 'X' })
    expect(fetchMock().mock.calls[0][0]).toContain('/aa/api/v1/reflexiones/mi_slug')
  })

  it('getReflectionDetail con valor vacío no llama a fetch y devuelve null', async () => {
    const result = await api.getReflectionDetail('')
    expect(result).toBeNull()
    expect(fetchMock()).not.toHaveBeenCalled()
  })

  it('getReflectionDetail sin envelope.data devuelve null (contrato del sitio)', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ titulo: 'directo' }))
    const result = await api.getReflectionDetail('x')
    expect(result).toBeNull()
  })

  it('getEventDetail con valor vacío devuelve null sin fetch', async () => {
    const result = await api.getEventDetail('')
    expect(result).toBeNull()
    expect(fetchMock()).not.toHaveBeenCalled()
  })
})

describe('api: postCuestionario', () => {
  const payload = {
    respuestas: [{ cuestionario_id: 1, respuesta: true }],
    llamame: true,
    telefono: '777 123 4567',
  }

  it('envía POST con JSON al endpoint /cuestionario', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, intento_id: 42 }))
    const result = await api.postCuestionario(payload)
    expect(result).toEqual({ ok: true, intento_id: 42 })

    const [url, options] = fetchMock().mock.calls[0]
    expect(url).toBe('https://api.aamorelos.org/aa/api/v1/cuestionario')
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual(payload)
  })

  it('fallback a error genérico si el status no es 2xx', async () => {
    fetchMock().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('not json')
      },
    })
    await expect(api.postCuestionario(payload)).rejects.toThrow('Error 500 al consultar la API')
  })
})

describe('api: normalización de errores de la API', () => {
  it('detail con string pasa tal cual', async () => {
    fetchMock().mockResolvedValue(
      jsonResponse({ detail: 'Estado no encontrado' }, { ok: false, status: 404 }),
    )
    await expect(api.getStateGroups('17')).rejects.toThrow('Estado no encontrado')
  })

  it('detail con lista FastAPI une loc y msg', async () => {
    fetchMock().mockResolvedValue(
      jsonResponse(
        {
          detail: [
            { loc: ['body', 'slogan'], msg: 'Field required' },
            { msg: 'Value error, debe ser numérico' },
          ],
        },
        { ok: false, status: 422 },
      ),
    )
    await expect(api.postCuestionario({ llamame: true })).rejects.toThrow(
      'slogan: Field required',
    )
    await expect(api.postCuestionario({ llamame: true })).rejects.toThrow(
      'debe ser numérico',
    )
  })

  it('error string gana sobre detail si viene', async () => {
    fetchMock().mockResolvedValue(
      jsonResponse({ error: 'boom', detail: 'otro' }, { ok: false, status: 500 }),
    )
    await expect(api.getHealth()).rejects.toThrow('boom')
  })

  it('message string gana sobre error/detail', async () => {
    fetchMock().mockResolvedValue(
      jsonResponse({ message: 'm-first', error: 'e-second', detail: 'd-third' }, {
        ok: false,
        status: 500,
      }),
    )
    await expect(api.getHealth()).rejects.toThrow('m-first')
  })

  it('detail vacío cae al mensaje genérico', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ detail: [] }, { ok: false, status: 404 }))
    await expect(api.getHealth()).rejects.toThrow('Error 404 al consultar la API')
  })

  it('detail sin JSON utilizable produce Error <status>', async () => {
    fetchMock().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => {
        throw new Error('html response')
      },
    })
    await expect(api.getHealth()).rejects.toThrow('Error 503 al consultar la API')
  })
})

describe('api: endpoints de geo y detalle', () => {
  it('getStateDistricts construye la ruta /areas/.../distritos por defecto 17', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: [] }))
    await api.getStateDistricts()
    expect(fetchMock().mock.calls[0][0]).toBe(
      'https://api.aamorelos.org/aa/api/v1/estados/17/distritos',
    )
  })

  it('getAreaDistricts usa el areaId', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: [] }))
    await api.getAreaDistricts('42')
    expect(fetchMock().mock.calls[0][0]).toBe(
      'https://api.aamorelos.org/aa/api/v1/areas/42/distritos',
    )
  })

  it('getDistrictGroups usa distritos/{id}/grupos', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: [] }))
    await api.getDistrictGroups('7')
    expect(fetchMock().mock.calls[0][0]).toBe(
      'https://api.aamorelos.org/aa/api/v1/distritos/7/grupos',
    )
  })

  it('getStateGroups usa estados/{id}/grupos', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: [] }))
    await api.getStateGroups('33')
    expect(fetchMock().mock.calls[0][0]).toBe(
      'https://api.aamorelos.org/aa/api/v1/estados/33/grupos',
    )
  })

  it('getDistrictDetail usa distritos/{id}', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: {} }))
    await api.getDistrictDetail('4')
    expect(fetchMock().mock.calls[0][0]).toBe(
      'https://api.aamorelos.org/aa/api/v1/distritos/4',
    )
  })

  it('getGroupDetail usa estados/{estado}/grupos/{grupo}', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: {} }))
    await api.getGroupDetail('99', '5')
    expect(fetchMock().mock.calls[0][0]).toBe(
      'https://api.aamorelos.org/aa/api/v1/estados/5/grupos/99',
    )
  })

  it('getDirectorio consulta /directorio/', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: [] }))
    await api.getDirectorio()
    expect(fetchMock().mock.calls[0][0]).toBe(
      'https://api.aamorelos.org/aa/api/v1/directorio/',
    )
  })

  it('getReflexionDiaria env�a fecha en el query', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: [] }))
    await api.getReflexionDiaria('11-17')
    expect(fetchMock().mock.calls[0][0]).toContain('fecha=11-17')
  })

  it('getEventDetail devuelve data del envelope con un slug v�lido', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: { id: 7 } }))
    const result = await api.getEventDetail('mi-evento')
    expect(result).toEqual({ id: 7 })
  })

  it('getEventDetail con valor que no aporta slug devuelve null', async () => {
    fetchMock().mockResolvedValue(jsonResponse({ ok: true, data: { id: 7 } }))
    const result = await api.getEventDetail('#')
    expect(result).toBeNull()
    expect(fetchMock()).not.toHaveBeenCalled()
  })
})

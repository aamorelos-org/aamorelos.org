import { describe, it, expect } from 'vitest'
import {
  isExternal,
  assetUrl,
  mediaUrl,
  slugFromUrl,
  legacyToRoute,
  groupRoute,
  districtRoute,
  committeeRoute,
  reflectionRoute,
  eventLink,
} from './links'

describe('isExternal', () => {
  it('reconoce URLs absolutas http(s)', () => {
    expect(isExternal('https://example.com')).toBe(true)
    expect(isExternal('http://example.com')).toBe(true)
    expect(isExternal('HTTPS://EXAMPLE.COM')).toBe(true)
  })

  it('rutas relativas y vacías no son externas', () => {
    expect(isExternal('/reflexiones')).toBe(false)
    expect(isExternal('')).toBe(false)
    expect(isExternal('#x')).toBe(false)
  })
})

describe('assetUrl', () => {
  it('normaliza ruta relativa con barra inicial', () => {
    expect(assetUrl('assets/logo.webp')).toBe('/assets/logo.webp')
    expect(assetUrl('/logo.webp')).toBe('/logo.webp')
    expect(assetUrl('///logo.webp')).toBe('/logo.webp')
  })

  it('respeta URLs absolutas', () => {
    expect(assetUrl('https://cdn.example.com/a.webp')).toBe('https://cdn.example.com/a.webp')
  })

  it('vacío devuelve vacío', () => {
    expect(assetUrl('')).toBe('')
    expect(assetUrl()).toBe('')
  })
})

describe('mediaUrl', () => {
  it('acepta string directo o objeto { imagen }', () => {
    expect(mediaUrl('img.webp')).toBe('/img.webp')
    expect(mediaUrl({ imagen: 'https://x.test/a.webp' })).toBe('https://x.test/a.webp')
  })
})

describe('slugFromUrl', () => {
  it('extrae el slug de una URL legacy .php relativa', () => {
    expect(slugFromUrl('/pages/eventos/invitacion_37178.php')).toBe('invitacion_37178')
    expect(slugFromUrl('/reflexiones/32_semana_nacional.php')).toBe('32_semana_nacional')
  })

  it('las URLs absolutas se rechazan (el sitio trabaja con rutas relativas)', () => {
    expect(slugFromUrl('https://aamorelos.org/reflexiones/32_semana_nacional.php')).toBe('')
  })

  it('ignora query strings y fragmentos', () => {
    expect(slugFromUrl('/reflexiones/32_semana_nacional.php?id=1#x')).toBe('32_semana_nacional')
  })

  it('URLs externas o nulas devuelven vacío', () => {
    expect(slugFromUrl('https://example.com/x.php')).toBe('')
    expect(slugFromUrl('')).toBe('')
    expect(slugFromUrl('#')).toBe('')
  })
})

describe('legacyToRoute', () => {
  it('mapea index.php a /', () => {
    expect(legacyToRoute('index.php')).toEqual({ to: '/', external: false })
  })

  it('conserva URLs absolutas como externas', () => {
    expect(legacyToRoute('https://x.test/a.php')).toEqual({
      to: 'https://x.test/a.php',
      external: true,
    })
  })

  it('limpia slashes iniciales del resto', () => {
    expect(legacyToRoute('/pages/grupos/grupos.php')).toEqual({
      to: '/pages/grupos/grupos.php',
      external: false,
    })
  })
})

describe('rutas de detalle', () => {
  it('construye rutas con id codificado', () => {
    expect(groupRoute('12 3')).toBe('/pages/grupos/detalle_grupo.php?id=12%203')
    expect(districtRoute('5')).toBe('/pages/distritos/detalle_distrito.php?id=5')
    expect(committeeRoute('9')).toBe('/pages/comites/detalle_comite.php?id=9')
  })

  it('reflectionRoute prefiere el slug de la url relativa cuando existe', () => {
    expect(reflectionRoute({ slogan: 'mi_slug', url: '/pages/reflexiones/otro.php' })).toBe(
      '/pages/reflexiones/otro',
    )
    expect(reflectionRoute({ slogan: 'mi_slug', url: 'https://x.test/otro.php' })).toBe(
      '/pages/reflexiones/mi_slug',
    )
  })

  it('reflectionRoute cae a detalle_reflexion.php?id= sin slug ni url', () => {
    expect(reflectionRoute({ id: 77 })).toBe('/pages/reflexiones/detalle_reflexion.php?id=77')
  })

  it('eventLink usa la url legacy cuando la tiene', () => {
    expect(eventLink({ url: '/pages/eventos/invitacion_1.php' })).toEqual({
      to: '/pages/eventos/invitacion_1.php',
      external: false,
    })
  })

  it('eventLink construye route desde slogan si no hay url', () => {
    expect(eventLink({ slogan: 'abc', tipo: 'informativo' })).toEqual({
      to: '/pages/eventos/abc',
      external: false,
    })
    expect(eventLink({ slogan: 'abc', tipo: 'invitacion' })).toEqual({
      to: '/pages/eventos/abc.php',
      external: false,
    })
  })
})

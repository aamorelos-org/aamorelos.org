import { describe, it, expect } from 'vitest'
import {
  normalizeText,
  matchesQuery,
  matchesRecord,
  toSlug,
  formatPhoneHref,
} from './text'

describe('normalizeText', () => {
  it('quita acentos, baja mayúsculas y recorta', () => {
    expect(normalizeText('  Fundador AMADÉU  ')).toBe('fundador amadeu')
  })

  it('acepta cualquier valor (no strings también)', () => {
    expect(normalizeText(null)).toBe('null')
  })
})

describe('matchesQuery', () => {
  it('query vacía coincide con todo', () => {
    expect(matchesQuery('cualquier cosa', '')).toBe(true)
    expect(matchesQuery('cualquier cosa', null)).toBe(true)
  })

  it('encuentra subcadena sin distinguir acentos ni mayúsculas', () => {
    expect(matchesQuery('Corazones de Morelos', 'corazon')).toBe(true)
    expect(matchesQuery('Cuernavaca', 'cuern')).toBe(true)
    expect(matchesQuery('Cuernavaca', 'xyz')).toBe(false)
  })
})

describe('matchesRecord', () => {
  it('excluye los campos de imagen de la búsqueda', () => {
    expect(matchesRecord({ imagen: 'tragamonedas', nombre: 'Grupo Sol' }, 'tragamonedas')).toBe(false)
    expect(matchesRecord({ imagen: 'foto.webp', nombre: 'Grupo Sol' }, 'sol')).toBe(true)
    expect(matchesRecord({ image: 'logo', nombre: 'Grupo Sol' }, 'logo')).toBe(false)
  })

  it('serializa objetos y números al comparar', () => {
    expect(matchesRecord({ distrito: 2 }, '2')).toBe(true)
    expect(matchesRecord({ dias: ['lunes', 'miércoles'] }, 'lunes')).toBe(true)
  })

  it('null/undefined en campos no rompe', () => {
    expect(matchesRecord({ a: null, b: undefined, c: 'sol' }, 'sol')).toBe(true)
  })
})

describe('toSlug', () => {
  it('normaliza a snake_case seguro', () => {
    expect(toSlug('Semana Nacional 2026')).toBe('semana_nacional_2026')
    expect(toSlug('Última Versión (v2)')).toBe('ultima_version_v2')
  })

  it('colapsa guiones bajos y los recorta en bordes', () => {
    expect(toSlug('__a__b__')).toBe('a_b')
    expect(toSlug('_-x_')).toBe('-x')
  })

  it('las tildes y eñes se normalizan; caracteres no permitidos se convierten en _', () => {
    expect(toSlug('Niño/Niña')).toBe('nino_nina')
    expect(toSlug('Última versión')).toBe('ultima_version')
  })

  it('entrada vacía produce slug vacío', () => {
    expect(toSlug('')).toBe('')
  })
})

describe('formatPhoneHref', () => {
  it('10 dígitos agrega +52', () => {
    expect(formatPhoneHref('777 123 4567')).toBe('+527771234567')
  })

  it('más de 10 dígitos conserva con +', () => {
    expect(formatPhoneHref('+1 555 123 4567')).toBe('+15551234567')
  })

  it('sin dígitos devuelve vacío', () => {
    expect(formatPhoneHref('—')).toBe('')
  })
})

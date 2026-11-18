import { describe, it, expect } from 'vitest'
import { parseBookAnnotation } from './annotation'

const SAMPLE = [
  '<!-- pagina-pdf: 99 -->',
  '<!-- pagina-impresa: 103 -->',
  '<!-- matches',
  '{',
  '  "11-10": [26],',
  '  "11-11": [24, 25]',
  '}',
  '-->',
  '## U N D E C I M O P A S O',
  '103',
  '',
  'lineas veintecuatro',
  'lineas veinticinco',
  'lineas veintiseis',
].join('\n')

describe('parseBookAnnotation', () => {
  it('parsea el bloque matches y lo expone como mapa', () => {
    const { matches } = parseBookAnnotation(SAMPLE)
    expect(matches['11-10']).toEqual([26])
    expect(matches['11-11']).toEqual([24, 25])
  })

  it('las líneas visibles llevan índice 1-based ABSOLUTO del archivo', () => {
    const { visible } = parseBookAnnotation(SAMPLE)
    const encabezado = visible.find((l) => l.text.startsWith('##'))
    expect(encabezado.index).toBe(9)
    expect(visible.find((l) => l.text === 'lineas veintiseis').index).toBe(14)
  })

  it('las líneas de comentario no aparecen en visible', () => {
    const { visible } = parseBookAnnotation(SAMPLE)
    expect(visible.some((l) => l.text.includes('<!--'))).toBe(false)
    expect(visible.some((l) => l.text.trim() === '}')).toBe(false)
  })

  it('acepta finales de línea CRLF igual que LF', () => {
    const crlf = parseBookAnnotation(SAMPLE.replace(/\n/g, '\r\n'))
    expect(crlf.matches['11-10']).toEqual([26])
    expect(crlf.visible.find((l) => l.text.startsWith('##')).index).toBe(9)
  })

  it('tolera JSON inválido: conserva visible y matches vacío', () => {
    const raw = [
      '<!-- matches',
      '{ no es json }',
      '-->',
      '## Encabezado',
      'cuerpo',
    ].join('\n')
    const { matches, visible } = parseBookAnnotation(raw)
    expect(matches).toEqual({})
    expect(visible.map((l) => l.text)).toEqual(['## Encabezado', 'cuerpo'])
  })

  it('fusiona keys de varios bloques matches', () => {
    const raw = [
      '<!-- matches',
      '{',
      '  "11-10": [10]',
      '}',
      '-->',
      '<!-- matches',
      '{',
      '  "11-11": [20]',
      '}',
      '-->',
      'cuerpo',
    ].join('\n')
    const { matches } = parseBookAnnotation(raw)
    expect(matches).toEqual({ '11-10': [10], '11-11': [20] })
  })

  it('entrada vacía/nula devuelve estructuras vacías', () => {
    expect(parseBookAnnotation('')).toEqual({ matches: {}, visible: [] })
    expect(parseBookAnnotation(null)).toEqual({ matches: {}, visible: [] })
    expect(parseBookAnnotation(undefined)).toEqual({ matches: {}, visible: [] })
  })
})

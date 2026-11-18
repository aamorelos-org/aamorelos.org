// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { renderRichText } from './richText'

describe('renderRichText', () => {
  it('convierte texto plano con doble salto en párrafos <p>', () => {
    const html = renderRichText('primero\n\nsegundo')
    expect(html).toContain('<p>primero</p>')
    expect(html).toContain('<p>segundo</p>')
  })

  it('convierte saltos simples del texto plano en <br>', () => {
    const html = renderRichText('línea 1\nlínea 2')
    expect(html).toContain('línea 1<br>línea 2')
  })

  it('escapa el texto plano: < y & no se interpretan como HTML', () => {
    const html = renderRichText('1 < 2 & 3 > 2')
    expect(html).not.toContain('>3')
    expect(html).toContain('&lt;')
    expect(html).toContain('&amp;')
  })

  it('acepta etiquetas permitidas del HTML', () => {
    const html = renderRichText('<strong>negrita</strong> y <em>cursiva</em>')
    expect(html).toContain('<strong>negrita</strong>')
    expect(html).toContain('<em>cursiva</em>')
  })

  it('acepta tablas', () => {
    const html = renderRichText('<table><tr><td colspan="2">celda</td></tr></table>')
    expect(html).toContain('<table>')
    expect(html).toContain('colspan="2"')
  })

  it('conserva enlaces http(s) con target', () => {
    const html = renderRichText('<a href="https://example.com" target="_blank">enlace</a>')
    expect(html).toContain('href="https://example.com"')
    expect(html).toContain('target="_blank"')
  })

  it('elimina href javascript: de los enlaces', () => {
    const html = renderRichText('<a href="javascript:alert(1)">click</a>')
    expect(html).not.toContain('javascript:')
  })

  it('elimina <script> completo', () => {
    const html = renderRichText('<p>hola</p><script>alert(1)</script><p>adiós</p>')
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('alert(1)')
    expect(html).toContain('hola')
    expect(html).toContain('adiós')
  })

  it('elimina iframes', () => {
    const html = renderRichText('<iframe src="https://evil.example"></iframe><p>ok</p>')
    expect(html).not.toContain('<iframe>')
    expect(html).toContain('ok')
  })

  it('elimina atributos de evento (onclick/onerror)', () => {
    const html = renderRichText('<p onclick="alert(1)">x</p>')
    expect(html).not.toContain('onclick')
  })

  it('elimina imágenes (tag no permitido) pero conserva el texto', () => {
    const html = renderRichText('<p><img src="x" onerror="alert(1)">texto</p>')
    expect(html).not.toContain('<img')
    expect(html).toContain('texto')
  })

  it('texto con "<" suelto no se interpreta como HTML', () => {
    const html = renderRichText('cuesta < de 100')
    expect(html).toContain('&lt;')
  })

  it('devuelve cadena vacía para null/undefined', () => {
    expect(renderRichText(null)).toBe('')
    expect(renderRichText(undefined)).toBe('')
  })
})

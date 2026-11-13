import DOMPurify from 'dompurify'

const ALLOWED_TAGS = [
  'p', 'br', 'hr',
  'div', 'span',
  'strong', 'b', 'em', 'i', 'u', 's', 'del',
  'ul', 'ol', 'li',
  'blockquote',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'colgroup', 'col',
  'a', 'sub', 'sup',
]
const ALLOWED_ATTR = [
  'href', 'target', 'rel',
  'style',
  'colspan', 'rowspan', 'span',
]

const escapeHtml = (text) =>
  String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/**
 * Normaliza la descripción para mostrarla (HTML del WYSIWYG, texto plano legacy,
 * o póster HTML pegado por el admin) y la sanea: bloquea scripts, iframes,
 * formularios y atributos de evento; permite posters completos (tabla, div/span,
 * títulos, estilos inline) porque son contenido propio de un admin autenticado.
 * Devuelve string usable en dangerouslySetInnerHTML.
 */
export function renderRichText(text) {
  const raw = String(text ?? '')
  // ¿Parece HTML real? etiqueta con nombre que contiene algo dentro o auto-cierra.
  const looksHtml = /<\w[^>]*>/.test(raw)
  const html = looksHtml
    ? raw
    : raw
        .split(/\r?\n\s*\r?\n/)
        .map(
          (block) =>
            `<p>${escapeHtml(block).replace(/\r?\n/g, '<br>')}</p>`,
        )
        .join('')

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  })
}

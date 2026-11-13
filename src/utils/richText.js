import DOMPurify from 'dompurify'

const ALLOWED_TAGS = [
  'p', 'br', 'hr',
  'strong', 'b', 'em', 'i', 'u', 's', 'del',
  'ul', 'ol', 'li',
  'blockquote',
  'h2', 'h3', 'h4',
  'a',
]
const ALLOWED_ATTR = ['href', 'target', 'rel']

const escapeHtml = (text) =>
  String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/**
 * Normaliza la descripción para mostrarla (HTML del WYSIWYG, o texto plano
 * legacy con doble salto de párrafo) y la sanitiza con una allowlist estricta.
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

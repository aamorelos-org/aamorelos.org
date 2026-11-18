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
 * Normaliza la descripción (HTML o texto plano) y la sanea para usarla en
 * dangerouslySetInnerHTML con una allowlist estricta.
 */
export function renderRichText(text) {
  const raw = String(text ?? '')
  if (!raw.trim()) {
    return ''
  }
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

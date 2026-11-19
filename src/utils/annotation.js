/**
 * @fileoverview Parse de un `.md` anotado con `<!-- matches -->` (un JSON embebido
 * entre comentarios). Devuelve las líneas del cuerpo (comentarios ocultos) y el
 * mapa de coincidencias con los índices de línea originales.
 * Ver formato de anotación en los scripts de conversión (anotar_md.py).
 */

/**
 * Interpreta un `.md` anotado para el visor "Fuente del texto".
 * @param raw Contenido completo del documento; puede ser null.
 * @return Documento { matches, visible } donde `matches` mapea fecha (MM-DD) a
 *   índices de línea 1-based y `visible` son las líneas no comentadas con su índice.
 */
export function parseBookAnnotation(raw) {
  if (!raw) {
    return { matches: {}, visible: [] }
  }
  const text = String(raw || '').replace(/\r\n/g, '\n')
  const lines = text.split('\n')

  const matches = {}
  const collectMatches = (blockLines) => {
    let body = blockLines.join('\n')
    if (body.startsWith('<!--')) {
      body = body.slice(4)
    }
    body = body.trimStart()
    if (body.toLowerCase().startsWith('matches')) {
      body = body.slice('matches'.length)
    }
    if (body.trimEnd().endsWith('-->')) {
      body = body.trimEnd().slice(0, -3)
    }
    body = body.trim()
    try {
      Object.assign(matches, JSON.parse(body))
    } catch {
    }
  }

  const visible = []
  let comment = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!comment) {
      const isCommentOpen = /^<!--\s*(pagina-pdf|pagina-impresa|matches)\b/i.test(trimmed)
      if (isCommentOpen) {
        const isMatches = /^<!--\s*matches\b/i.test(trimmed)
        if (trimmed.endsWith('-->')) {
          if (isMatches) {
            collectMatches([trimmed])
          }
        } else {
          comment = { isMatches, lines: [trimmed] }
        }
        continue
      }
      visible.push({ index: i + 1, text: line })
      continue
    }

    comment.lines.push(line)
    if (trimmed.endsWith('-->')) {
      if (comment.isMatches) {
        collectMatches(comment.lines)
      }
      comment = null
    }
  }

  if (comment?.isMatches) {
    collectMatches(comment.lines)
  }

  return { matches, visible }
}

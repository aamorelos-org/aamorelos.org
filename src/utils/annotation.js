// Parse de un .md anotado (bloque `<!-- matches -->` con JSON).
// Ver formato de anotación en scripts de conversión (anotar_md.py).
export function parseBookAnnotation(raw) {
  if (!raw) {
    return { matches: {}, visible: [] }
  }
  const text = String(raw || '').replace(/\r\n/g, '\n')
  const lines = text.split('\n')

  const matches = {}
  const matchesRegex = /<!--\s*matches[\s\S]*?-->/gi
  let match
  const rawNormalizado = text
  while ((match = matchesRegex.exec(rawNormalizado)) !== null) {
    const body = match[0].replace(/^<!--\s*matches\s*/i, '').replace(/\s*-->$/, '')
    try {
      Object.assign(matches, JSON.parse(body))
    } catch {
      // JSON inválido: se conserva matches con lo ya leído
    }
  }

  const visible = []
  let inCommentBlock = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!inCommentBlock) {
      if (/^<!--\s*(pagina-pdf|pagina-impresa|matches)\b/.test(trimmed)) {
        if (!trimmed.endsWith('-->')) {
          inCommentBlock = true
        }
        continue
      }
      visible.push({ index: i + 1, text: line })
      continue
    }

    if (trimmed.endsWith('-->')) {
      inCommentBlock = false
    }
  }

  return { matches, visible }
}

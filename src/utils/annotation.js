// Parse de un .md anotado con `<!-- matches -->` (un JSON embebido entre
// comentarios). Devuelve las líneas del cuerpo (comentarios ocultos) y el
// mapa de coincidencias con los índices de línea originales.
//
// Forma mínima:
//   <!-- pagina-pdf: 99 -->
//   <!-- pagina-impresa: 103 -->
//   <!-- matches
//   {
//     "04-30": [10, 11, 12]
//   }
//   -->
//   contenido ...

export function parseBookAnnotation(raw) {
  const text = String(raw || '').replace(/\r\n/g, '\n')
  const lines = text.split('\n')

  // 1) Extraer coincidencias del bloque <!-- matches ... -->
  const matches = {}
  const matchesRegex = /<!--\s*matches[\s\S]*?-->/gi
  let match
  while ((match = matchesRegex.exec(text)) !== null) {
    const body = match[0].replace(/^<!--\s*matches\s*/i, '').replace(/\s*-->$/, '')
    try {
      Object.assign(matches, JSON.parse(body))
    } catch {
      // JSON malformado: dejamos `matches` con lo ya parseado
    }
  }

  // 2) Generar las líneas visibles conservando el índice original (1-based)
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
        continue // skip la línea inicial (single-line o apertura del bloque)
      }
      visible.push({ index: i + 1, text: line })
      continue
    }

    // Estamos dentro de un bloque comment; lo saltamos hasta el cierre
    if (trimmed.endsWith('-->')) {
      inCommentBlock = false
    }
  }

  return { matches, visible }
}

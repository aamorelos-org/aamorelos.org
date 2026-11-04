export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

const WEBP_QUALITY = 0.9

/**
 * Convierte un archivo de imagen a WebP en el navegador.
 * Devuelve el base64 (sin prefijo data:) listo para enviar a la API.
 */
export function fileToWebpBase64(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    const cleanup = () => URL.revokeObjectURL(objectUrl)

    image.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight

        const context = canvas.getContext('2d')
        if (!context) {
          cleanup()
          reject(new Error('Tu navegador no permite convertir la imagen.'))
          return
        }

        // Fondo blanco: evita que los PNG con transparencia se conviertan en negro.
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0)

        canvas.toBlob(
          (blob) => {
            cleanup()

            if (!blob || blob.type !== 'image/webp') {
              reject(new Error('Tu navegador no soporta la conversión a WebP. Usa Chrome, Edge, Firefox o Safari 16+.'))
              return
            }

            const reader = new FileReader()
            reader.onload = () => {
              const dataUrl = String(reader.result || '')
              resolve(dataUrl.split(',')[1] || '')
            }
            reader.onerror = () => reject(new Error('No se pudo leer la imagen convertida.'))
            reader.readAsDataURL(blob)
          },
          'image/webp',
          WEBP_QUALITY,
        )
      } catch (err) {
        cleanup()
        reject(err instanceof Error ? err : new Error('No se pudo convertir la imagen.'))
      }
    }

    image.onerror = () => {
      cleanup()
      reject(new Error('El archivo seleccionado no es una imagen válida.'))
    }

    image.src = objectUrl
  })
}

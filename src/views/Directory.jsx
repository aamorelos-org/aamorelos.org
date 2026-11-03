import { useCallback, useEffect, useState } from 'react'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { assetUrl } from '../utils/links'
import pageStyles from './Page.module.css'
import styles from './Directory.module.css'

const images = Array.from({ length: 10 }, (_, index) => {
  const number = String(index + 1).padStart(4, '0')
  return `images/directorio/DIRECTORIO 2026 SEPTIEMBRE_${number}.jpg`
})

export default function Directory() {
  useDocumentTitle('Directorio institucional')

  const [selected, setSelected] = useState(null)

  const close = useCallback(() => setSelected(null), [])

  const go = useCallback((direction) => {
    setSelected((current) => {
      if (current === null) {
        return current
      }
      return (current + direction + images.length) % images.length
    })
  }, [])

  useEffect(() => {
    if (selected === null) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        close()
      }
      if (event.key === 'ArrowLeft') {
        go(-1)
      }
      if (event.key === 'ArrowRight') {
        go(1)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [close, go, selected])

  return (
    <div className={pageStyles.page}>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Directorio' }]} />

      <header className={pageStyles.pageHeader}>
        <span className={pageStyles.eyebrow}>Directorio institucional</span>
        <h1 className={pageStyles.title}>Directorio de servicios</h1>
        <p className={pageStyles.lead}>
          Consulta el directorio institucional del Área Morelos. Selecciona una página para verla
          en tamaño completo.
        </p>
      </header>

      <div className={styles.grid}>
        {images.map((image, index) => (
          <button
            type="button"
            className={styles.card}
            key={image}
            onClick={() => setSelected(index)}
            aria-label={`Ver página ${index + 1} del directorio`}
          >
            <div className={styles.media}>
              <img
                src={assetUrl(image)}
                alt={`Página ${index + 1} del directorio institucional de Alcohólicos Anónimos Área Morelos`}
                loading="lazy"
              />
            </div>
            <div className={styles.body}>
              <h2>Página {index + 1}</h2>
              <p>Directorio 2026 · Septiembre</p>
            </div>
          </button>
        ))}
      </div>

      {selected !== null ? (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Visor del directorio institucional"
          onClick={close}
        >
          <button type="button" className={styles.modalClose} onClick={close} aria-label="Cerrar visor">
            ×
          </button>

          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <img
              className={styles.modalImage}
              src={assetUrl(images[selected])}
              alt={`Página ${selected + 1} del directorio institucional ampliada`}
            />
            <div className={styles.modalNav}>
              <button type="button" className={styles.modalButton} onClick={() => go(-1)}>
                ← Anterior
              </button>
              <span>{selected + 1} / {images.length}</span>
              <button type="button" className={styles.modalButton} onClick={() => go(1)}>
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

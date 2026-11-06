import { useCallback, useEffect, useState } from 'react'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import { assetUrl } from '../utils/links'
import pageStyles from './Page.module.css'
import styles from './Directory.module.css'

function pageLabel(item, index) {
  return item?.pagina != null ? `Página ${item.pagina}` : `Página ${index + 1}`
}

function periodLabel(item) {
  const parts = [item?.anio, item?.mes].filter(Boolean)
  return parts.length ? `Directorio ${parts.join(' · ')}` : 'Directorio'
}

export default function Directory() {
  useDocumentTitle('Directorio institucional')

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    api
      .getDirectorio()
      .then((response) => {
        if (active) {
          const list = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : [])
          setItems(list)
          setLoadError('')
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setItems([])
          setLoadError('No se pudo cargar el directorio. Intenta recargar la página.')
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const close = useCallback(() => setSelected(null), [])

  const go = useCallback((direction) => {
    setSelected((current) => {
      if (current === null) {
        return current
      }
      return (current + direction + items.length) % items.length
    })
  }, [items.length])

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

      {loading ? (
        <p className={styles.empty}>Cargando directorio...</p>
      ) : loadError ? (
        <p className={styles.empty}>{loadError}</p>
      ) : items.length === 0 ? (
        <p className={styles.empty}>No hay páginas de directorio registradas.</p>
      ) : (
        <div className={styles.grid}>
          {items.map((item, index) => (
            <button
              type="button"
              className={styles.card}
              key={item.id ?? item.imagen ?? index}
              onClick={() => setSelected(index)}
              aria-label={`Ver ${pageLabel(item, index).toLowerCase()} del directorio`}
            >
              <div className={styles.media}>
                <img
                  src={assetUrl(item.imagen)}
                  alt={`${pageLabel(item, index)} del directorio institucional de Alcohólicos Anónimos Área Morelos`}
                  loading="lazy"
                />
              </div>
              <div className={styles.body}>
                <h2>{pageLabel(item, index)}</h2>
                <p>{periodLabel(item)}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected !== null && items[selected] ? (
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
              src={assetUrl(items[selected].imagen)}
              alt={`${pageLabel(items[selected], selected)} del directorio institucional ampliada`}
            />
            <div className={styles.modalNav}>
              <button type="button" className={styles.modalButton} onClick={() => go(-1)}>
                ← Anterior
              </button>
              <span>{pageLabel(items[selected], selected)} · {selected + 1} / {items.length}</span>
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

import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import { mediaUrl } from '../utils/links'
import styles from './Page.module.css'

export default function EventDetail() {
  const { slug = '' } = useParams()
  const cleanSlug = slug.replace(/\.php$/i, '')

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(Boolean(cleanSlug) && cleanSlug !== 'invitacion_37178')

  useEffect(() => {
    if (!cleanSlug || cleanSlug === 'invitacion_37178') {
      return undefined
    }

    let active = true

    api
      .getEventDetail(cleanSlug)
      .then((detail) => {
        if (active) {
          setEvent(detail)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [cleanSlug])

  useDocumentTitle(event?.title || (loading ? 'Cargando evento...' : 'Evento'))

  if (cleanSlug === 'invitacion_37178') {
    return <Navigate to="/pages/eventos/invitacion_37178.php" replace />
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Cargando evento desde el API...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Eventos', to: '/pages/info/eventos.php' }, { label: 'Evento no encontrado' }]} />
        <div className={styles.panel}>
          <h1 className={styles.title}>Evento no encontrado</h1>
          <p className={styles.lead}>
            La publicación solicitada no existe o ya no está disponible.
          </p>
          <div className={styles.ctaRow}>
            <Link className={styles.primaryButton} to="/pages/info/eventos.php">
              Ver todos los eventos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Eventos', to: '/pages/info/eventos.php' },
          { label: event.title },
        ]}
      />

      <Link className={styles.backLink} to="/pages/info/eventos.php">
        ← Volver a eventos
      </Link>

      <article className={styles.article}>
        <header className={styles.detailHeader}>
          <span className={styles.eyebrow}>Evento</span>
          <h1 className={styles.articleTitle}>{event.title}</h1>
          {event.subtitle ? <p className={styles.articleSubtitle}>{event.subtitle}</p> : null}
        </header>

        <div className={styles.imageFrame}>
          <img
            src={mediaUrl(event)}
            alt={event.alt || event.title}
            onError={(imageEvent) => {
              imageEvent.currentTarget.style.visibility = 'hidden'
            }}
          />
        </div>

        <div className={styles.prose}>
          {(event.paragraphs || []).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className={styles.footerNote}>
          <span>{event.footer}</span>
          <Link className={styles.secondaryButton} to="/pages/info/eventos.php">
            Ver más eventos
          </Link>
        </div>
      </article>
    </div>
  )
}

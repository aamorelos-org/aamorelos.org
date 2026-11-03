import { Link, Navigate, useParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getEventDetail } from '../data/eventDetails'
import { assetUrl } from '../utils/links'
import styles from './Page.module.css'

export default function EventDetail() {
  const { slug = '' } = useParams()
  const cleanSlug = slug.replace(/\.php$/i, '')
  const event = getEventDetail(cleanSlug)

  useDocumentTitle(event?.title || 'Evento')

  if (cleanSlug === 'invitacion_37178') {
    return <Navigate to="/pages/eventos/invitacion_37178.php" replace />
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
            src={assetUrl(event.image)}
            alt={event.alt || event.title}
            onError={(imageEvent) => {
              imageEvent.currentTarget.style.visibility = 'hidden'
            }}
          />
        </div>

        <div className={styles.prose}>
          {event.paragraphs.map((paragraph) => (
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

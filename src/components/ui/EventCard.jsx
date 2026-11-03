import { Link } from 'react-router-dom'
import { eventLink, mediaUrl } from '../../utils/links'
import styles from './EventCard.module.css'

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

export default function EventCard({ event }) {
  if (!event) {
    return null
  }

  const title = event.title || event.titulo || ''
  const detail = event.detail || event.detalle || event.subtitle || ''
  const image = mediaUrl(event)
  const link = eventLink(event)
  const content = (
    <>
      <div className={styles.media}>
        <img
          src={image}
          alt={event.alt || title}
          loading="lazy"
          onError={(imageEvent) => {
            imageEvent.currentTarget.style.visibility = 'hidden'
          }}
        />
      </div>
      <div className={styles.body}>
        <span className={styles.kicker}>Evento</span>
        <h3>{title}</h3>
        {detail ? <p>{detail}</p> : null}
        {link.to !== '#' ? (
          <span className={styles.cta}>
            Ver más
            <Arrow />
          </span>
        ) : null}
      </div>
    </>
  )

  if (link.to === '#') {
    return <article className={styles.card}>{content}</article>
  }

  if (link.external) {
    return (
      <a className={styles.card} href={link.to} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return (
    <Link className={styles.card} to={link.to}>
      {content}
    </Link>
  )
}

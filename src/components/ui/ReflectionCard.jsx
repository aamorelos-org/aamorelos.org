import { Link } from 'react-router-dom'
import { assetUrl, reflectionRoute } from '../../utils/links'
import styles from './ReflectionCard.module.css'

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

export default function ReflectionCard({ reflection }) {
  if (!reflection) {
    return null
  }

  const title = reflection.title || reflection.titulo || ''
  const subtitle = reflection.subtitle || reflection.subtitulo || ''
  const image = reflection.image || reflection.imagen || ''
  const alt = reflection.alt || title

  return (
    <article className={styles.card}>
      <Link to={reflectionRoute(reflection)} className={styles.link}>
        <div className={styles.media}>
          <img
            src={assetUrl(image)}
            alt={alt}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden'
            }}
          />
          <span className={styles.badge}>Reflexión</span>
        </div>
        <div className={styles.body}>
          {subtitle ? <span className={styles.kicker}>{subtitle}</span> : null}
          <h3>{title}</h3>
          <span className={styles.cta}>
            Leer reflexión
            <Arrow />
          </span>
        </div>
      </Link>
    </article>
  )
}

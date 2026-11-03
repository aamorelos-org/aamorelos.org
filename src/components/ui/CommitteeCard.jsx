import { Link } from 'react-router-dom'
import { legacyToRoute } from '../../utils/links'
import styles from './CommitteeCard.module.css'

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

export default function CommitteeCard({ committee }) {
  if (!committee) {
    return null
  }

  const link = legacyToRoute(committee.url)

  return (
    <article className={styles.card}>
      <span className={styles.mark} aria-hidden="true" />
      <h3>{committee.nombre}</h3>
      <p>{committee.descripcion}</p>
      {link.to !== '#' ? (
        link.external ? (
          <a className={styles.link} href={link.to} target="_blank" rel="noopener noreferrer">
            Leer más
            <Arrow />
          </a>
        ) : (
          <Link className={styles.link} to={link.to}>
            Leer más
            <Arrow />
          </Link>
        )
      ) : null}
    </article>
  )
}

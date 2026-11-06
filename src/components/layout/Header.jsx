import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import styles from './Header.module.css'

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6.6 3.5h2.2l1.5 4-2 1.4a13 13 0 0 0 6.8 6.8l1.4-2 4 1.5v2.2a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  )
}

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.logo} to="/" aria-label="Ir al inicio">
          <img
            src="https://images.aamorelos.org/logo-header.webp"
            alt="Central Mexicana de Servicios Generales de Alcohólicos Anónimos, A.C."
          />
        </Link>

        <div className={styles.content}>
          <p className={styles.eyebrow}>{site.organization}</p>
          <p className={styles.title}>{site.community}</p>
          <p className={styles.subtitle}>{site.district} · {site.tagline}</p>

          <div className={styles.contact}>
            <a href={`mailto:${site.email}`}>
              <MailIcon />
              <span>{site.email}</span>
            </a>
            <a href={`tel:${site.phoneHref}`}>
              <PhoneIcon />
              <span>{site.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

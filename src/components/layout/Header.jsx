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

/**
 * Cabecera principal del sitio (logo del área + navegación).
 */
export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.logo} to="/" aria-label="Ir al inicio">
          <img
            src="https://images.aamorelos.org/logo-area-morelos.webp"
            alt="Central Mexicana de Servicios Generales de Alcohólicos Anónimos, A.C."
          />
        </Link>

        <div className={styles.content}>
          <p className={styles.eyebrow}>{site.organization}</p>
          <p className={styles.title}>{site.community}</p>
          <p className={styles.subtitle}>{site.district} · {site.tagline}</p>

          <div className={styles.contact}>
            <div className={styles.contactGroup}>
              <span className={styles.contactLabel}>Área Morelos 1</span>
              <a href="tel:+527773090872">
                <PhoneIcon />
                <span>777 309-08-72</span>
              </a>
              <a href="mailto:area28@aamexico.org.mx">
                <MailIcon />
                <span>area28@aamexico.org.mx</span>
              </a>
            </div>
            <div className={styles.contactGroup}>
              <span className={styles.contactLabel}>Área Morelos 2</span>
              <a href="tel:+527353023873">
                <PhoneIcon />
                <span>(735) 302-38-73</span>
              </a>
              <a href="mailto:area82@aamexico.org.mx">
                <MailIcon />
                <span>area82@aamexico.org.mx</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

import { Link } from 'react-router-dom'
import { quickLinks, site } from '../../data/site'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logoLink}>
            <img src="https://images.aamorelos.org/logo.webp" alt="Alcohólicos Anónimos" />
          </Link>
          <p className={styles.brandTitle}>{site.community} · {site.name}</p>
          <p className={styles.brandText}>
            Una comunidad de hombres y mujeres que comparten su experiencia, fortaleza y esperanza
            para resolver su problema común y ayudar a otros a recuperarse del alcoholismo.
          </p>
        </div>

        <div className={styles.column}>
          <h2>Explora</h2>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.column}>
          <h2>Contacto</h2>
          <ul className={styles.contactList}>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            </li>
            <li>
              <a href="tel:8002169231">{site.nationalPhone} · línea nacional</a>
            </li>
            <li>
              <span>{site.address}</span>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h2>Un principio de servicio</h2>
          <p className={styles.note}>
            Alcohólicos Anónimos no está afiliada a ninguna secta, religión, partido político,
            organización o institución. No respalda ni se opone a ninguna causa.
          </p>
          <p className={styles.note}>
            Si tú o alguien que conoces necesita ayuda, acércate al grupo más cercano. La asistencia
            es voluntaria y gratuita.
          </p>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} Área Morelos · Central Mexicana de Servicios Generales de A.A., A.C.</p>
        <p>Unidad · Servicio · Recuperación</p>
      </div>
    </footer>
  )
}

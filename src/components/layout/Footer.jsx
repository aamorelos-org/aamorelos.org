import { Link } from 'react-router-dom'
import { quickLinks, site } from '../../data/site'
import styles from './Footer.module.css'

/**
 * Pie de página con enlaces rápidos y datos de contacto del área.
 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logoLink}>
            <img src="https://images.aamorelos.org/logo-area-morelos.webp" alt="Alcohólicos Anónimos" />
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
              <span className={styles.contactArea}>Área Morelos 1</span>
              <a href="tel:+527773090872">777 309-08-72</a>
              {' · '}
              <a href="mailto:area28@aamexico.org.mx">area28@aamexico.org.mx</a>
            </li>
            <li>
              <span className={styles.contactArea}>Área Morelos 2</span>
              <a href="tel:+527353023873">(735) 302-38-73</a>
              {' · '}
              <a href="mailto:area82@aamexico.org.mx">area82@aamexico.org.mx</a>
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
        <p>
          <Link to="/politica-de-privacidad">Política de privacidad</Link>
          {' · '}Unidad · Servicio · Recuperación
        </p>
      </div>
    </footer>
  )
}

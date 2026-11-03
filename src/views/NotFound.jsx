import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import styles from './Page.module.css'

export default function NotFound() {
  useDocumentTitle('Página no encontrada')

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <span className={styles.eyebrow}>Error 404</span>
        <h1 className={styles.title}>No encontramos esta página</h1>
        <p className={styles.lead}>
          Es posible que el enlace haya cambiado o que la página ya no esté disponible. Puedes
          volver al inicio o consultar el directorio de grupos.
        </p>
        <div className={styles.ctaRow}>
          <Link className={styles.primaryButton} to="/">
            Volver al inicio
          </Link>
          <Link className={styles.secondaryButton} to="/pages/grupos/grupos.php">
            Buscar un grupo
          </Link>
        </div>
      </div>
    </div>
  )
}

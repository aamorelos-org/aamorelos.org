import Breadcrumb from '../components/layout/Breadcrumb'
import EventCard from '../components/ui/EventCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import events from '../data/events.json'
import pageStyles from './Page.module.css'
import styles from './Listing.module.css'

export default function Events() {
  useDocumentTitle('Eventos y noticias')

  const internal = events.filter((event) => /\.php(\?.*)?$/i.test(event.url || '')).length
  const external = events.length - internal

  return (
    <div className={pageStyles.page}>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Eventos y noticias' }]} />

      <header className={pageStyles.pageHeader}>
        <span className={pageStyles.eyebrow}>Comunidad</span>
        <h1 className={pageStyles.title}>Eventos y noticias</h1>
        <p className={pageStyles.lead}>
          Actividades, celebraciones y convocatorias del Área Morelos y de la Central Mexicana de
          Servicios Generales de Alcohólicos Anónimos.
        </p>
      </header>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{events.length}</span>
          <span className={styles.statLabel}>Publicaciones</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{internal}</span>
          <span className={styles.statLabel}>Eventos del área</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{external}</span>
          <span className={styles.statLabel}>Enlaces externos</span>
        </div>
      </div>

      <div className={pageStyles.grid3}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

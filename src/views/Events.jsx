import { useEffect, useState } from 'react'
import Breadcrumb from '../components/layout/Breadcrumb'
import EventCard from '../components/ui/EventCard'
import Pagination from '../components/ui/Pagination'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import pageStyles from './Page.module.css'
import styles from './Listing.module.css'

const PAGE_SIZE = 20

export default function Events() {
  useDocumentTitle('Eventos y noticias')

  const [events, setEvents] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)

    api
      .getEvents({ skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE })
      .then((response) => {
        if (active) {
          const list = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : [])
          setEvents(list)
          setTotal(response?.total_registros ?? list.length)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [page])

  const internal = events.filter((event) => Boolean(event.slogan)).length
  const external = events.length - internal
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)

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
          <span className={styles.statValue}>{total}</span>
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

      {loading ? (
        <p className={pageStyles.lead}>Cargando eventos desde el API...</p>
      ) : (
        <>
          <div className={pageStyles.grid3}>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
        </>
      )}
    </div>
  )
}

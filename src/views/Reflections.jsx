import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import Pagination from '../components/ui/Pagination'
import ReflectionCard from '../components/ui/ReflectionCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import styles from './Reflections.module.css'

const PAGE_SIZE = 20

export default function Reflections() {
  useDocumentTitle('Reflexiones')

  const [reflections, setReflections] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    api.getReflections({ skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE })
      .then((res) => {
        if (active) {
          const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
          setReflections(list)
          setTotal(res?.total_registros ?? list.length)
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

  const reflectionItems = Array.isArray(reflections) ? reflections : []
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Reflexiones' }]} />

      <div className={styles.warmPage}>
        <section className={styles.hero} aria-labelledby="reflections-title">
          <div className={styles.heroBody}>
            <span className={styles.eyebrow}>Pausa y Bienestar</span>
            <h1 className={styles.title} id="reflections-title">
              Un momento para ti
            </h1>
            <p className={styles.lead}>
              Mensajes breves para acompañar el camino de la recuperación. No importa dónde estés
              hoy: siempre hay un paso pequeño que puedes dar.
            </p>
          </div>

          <aside className={styles.heroAside}>
            <h2>¿Estás bebiendo demasiado?</h2>
            <p>
              Si algo de lo que sientes te resulta familiar, pedir ayuda también es un acto de
              cuidado. Podemos escucharte sin juzgar.
            </p>
            <Link to="/pages/reflexiones/bebiendo_demasiado">
              Leer esta reflexión →
            </Link>
          </aside>
        </section>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--reflection-muted)' }}>
            Cargando reflexiones...
          </p>
        ) : (
          <>
            <div className={styles.grid}>
              {reflectionItems.map((reflection) => (
                <ReflectionCard key={reflection.id} reflection={reflection} />
              ))}
            </div>
            <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
          </>
        )}

        <blockquote className={styles.quote}>
          «La recuperación no siempre es un camino recto, pero cada paso cuenta. Hoy puedes elegir
          un pequeño gesto de cuidado para contigo.»
        </blockquote>
      </div>
    </div>
  )
}

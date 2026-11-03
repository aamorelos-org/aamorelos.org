import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import styles from './Page.module.css'

export default function CommitteeDetail() {
  const [searchParams] = useSearchParams()
  const rawId = searchParams.get('id') || ''
  const numericId = Number(rawId)

  const [committees, setCommittees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    api
      .getCommittees()
      .then((list) => {
        if (active) {
          setCommittees(Array.isArray(list) ? list : [])
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
  }, [])

  const committee =
    committees.find((item) => Number(item.id) === numericId) ||
    (numericId > 0 ? committees[numericId - 1] : null)

  useDocumentTitle(committee?.nombre || (loading ? 'Cargando comité...' : 'Comité no encontrado'))

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Cargando comité...</p>
      </div>
    )
  }

  if (!committee) {
    return (
      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Comités', to: '/#comites' }, { label: 'Comité no encontrado' }]} />
        <div className={styles.panel}>
          <h1 className={styles.title}>Comité no encontrado</h1>
          <p className={styles.lead}>El comité solicitado no existe o ya no está disponible.</p>
          <div className={styles.ctaRow}>
            <Link className={styles.primaryButton} to="/#comites">
              Volver a comités
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Comités', to: '/#comites' },
          { label: committee.nombre },
        ]}
      />

      <Link className={styles.backLink} to="/#comites">
        ← Volver a comités
      </Link>

      <article className={styles.article}>
        <header className={styles.detailHeader}>
          <span className={styles.eyebrow}>Comité de servicio</span>
          <h1 className={styles.articleTitle}>{committee.nombre}</h1>
          <p className={styles.articleSubtitle}>{committee.descripcion}</p>
        </header>

        {committee.detalle ? (
          <div className={styles.infoBox}>
            <p>{committee.detalle}</p>
          </div>
        ) : null}

        {committee.actividades?.length ? (
          <div className={styles.prose}>
            <h2>¿En qué se enfoca?</h2>
            <ul>
              {committee.actividades.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {committee.fuente ? (
          <div className={styles.footerNote}>
            <span>Fuente oficial</span>
            <a
              className={styles.secondaryButton}
              href={committee.fuente}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar en aa.org
            </a>
          </div>
        ) : null}
      </article>
    </div>
  )
}

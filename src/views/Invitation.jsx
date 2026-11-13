import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import FullScreenImage from '../components/ui/FullScreenImage'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import { mediaUrl } from '../utils/links'
import styles from './Invitation.module.css'

export default function Invitation() {
  useDocumentTitle('16 Aniversario · Grupo Hoy Volvemos a Empezar')

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    api
      .getEventDetail('invitacion_37178')
      .then((detail) => {
        if (active) {
          setEvent(detail)
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

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Cargando invitación desde el API...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Eventos', to: '/pages/info/eventos.php' }, { label: 'Invitación no encontrada' }]} />
        <div className={styles.heroBody}>
          <h1 className={styles.title}>Invitación no encontrada</h1>
          <p className={styles.lead}>La publicación solicitada no existe o ya no está disponible.</p>
          <Link className={styles.secondaryButton} to="/pages/info/eventos.php">
            Ver todos los eventos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Eventos', to: '/pages/info/eventos.php' },
          { label: '16 Aniversario' },
        ]}
      />

      <Link className={styles.secondaryButton} to="/pages/info/eventos.php">
        ← Volver a eventos
      </Link>

      <section className={styles.hero} aria-labelledby="inv-title">
        <div className={styles.heroBody}>
          {event.pie ? (
            <span className={styles.eyebrow}>{event.pie}</span>
          ) : null}
          <h1 className={styles.title} id="inv-title">
            {event.titulo}
          </h1>
          <p className={styles.subtitle}>{event.subtitulo}</p>
          <p className={styles.lead}>
            La Conciencia del Grupo agradece de corazón a los grupos, mesas, servidores y familias
            que hacen posibles estos días de unidad, y extiende una cordial invitación a acompañarnos
            en la Junta Pública de Información.
          </p>
        </div>

        <figure className={styles.heroMedia}>
          <FullScreenImage src={mediaUrl(event)} alt={event.alt || event.titulo} />
        </figure>
      </section>

      <p className={styles.footerNote}>Unidad · Servicio · Recuperación</p>
    </div>
  )
}

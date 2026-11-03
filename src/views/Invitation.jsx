import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import { mediaUrl } from '../utils/links'
import styles from './Invitation.module.css'

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

function monthLabel(date) {
  if (!date) {
    return ''
  }

  const parsed = new Date(`${date}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  return parsed.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '')
}

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

  const blocks = event.bloques_itinerario || []
  const fechas = event.resumen_fechas || {}
  const contacto = event.contacto || {}

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
          <span className={styles.eyebrow}>{event.epigrafe || event.footer}</span>
          <h1 className={styles.title} id="inv-title">
            {event.title}
          </h1>
          <p className={styles.subtitle}>{event.subtitle}</p>
          <p className={styles.lead}>
            La Conciencia del Grupo agradece de corazón a los grupos, mesas, servidores y familias
            que hacen posibles estos días de unidad, y extiende una cordial invitación a acompañarnos
            en la Junta Pública de Información.
          </p>

          <ul className={styles.metaList}>
            {fechas.dias_unidad ? (
              <li className={styles.metaItem}>
                <span className={styles.metaIcon}><CalendarIcon /></span>
                <span>
                  <span className={styles.metaLabel}>Días de Unidad</span>
                  {fechas.dias_unidad}
                </span>
              </li>
            ) : null}
            {fechas.junta_publica ? (
              <li className={styles.metaItem}>
                <span className={styles.metaIcon}><CalendarIcon /></span>
                <span>
                  <span className={styles.metaLabel}>Junta Pública</span>
                  {fechas.junta_publica}
                </span>
              </li>
            ) : null}
            {fechas.sede ? (
              <li className={styles.metaItem}>
                <span className={styles.metaIcon}><MapIcon /></span>
                <span>
                  <span className={styles.metaLabel}>Sede</span>
                  {fechas.sede}
                </span>
              </li>
            ) : null}
          </ul>

          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#itinerario">
              Consultar itinerario
            </a>
            {contacto.telefono_href ? (
              <a className={styles.secondaryButton} href={`tel:${contacto.telefono_href}`}>
                Informes: {contacto.telefono}
              </a>
            ) : null}
          </div>
        </div>

        <figure className={styles.heroMedia}>
          <img src={mediaUrl(event)} alt={event.alt || event.title} />
        </figure>
      </section>

      {event.frase_reflexion ? (
        <blockquote className={styles.quote}>{event.frase_reflexion}</blockquote>
      ) : null}

      <section className={styles.itinerary} id="itinerario" aria-labelledby="itinerario-title">
        <header className={styles.sectionHead}>
          <p className={styles.sectionScript}>Días de Unidad</p>
          <h2 id="itinerario-title">Itinerario</h2>
          <p>{fechas.dias_unidad ? `${fechas.dias_unidad} · Grupos y mesas participantes` : 'Grupos y mesas participantes'}</p>
        </header>

        {blocks.map((block) => (
          <div className={styles.block} key={block.id}>
            <div className={styles.blockHead}>
              <h3>{block.titulo}</h3>
              <span>{block.etiqueta}</span>
            </div>

            <div className={styles.days}>
              {(block.dias || []).map((day) => (
                <article
                  className={`${styles.day} ${day.es_junta_publica ? styles.dayJunta : ''}`}
                  key={day.fecha}
                >
                  <time className={styles.dayDate} dateTime={day.fecha}>
                    <span className={styles.weekday}>{day.dia}</span>
                    <span className={styles.dayNumber}>{day.numero}</span>
                    <span className={styles.month}>{monthLabel(day.fecha)}</span>
                  </time>

                  <div className={styles.dayBody}>
                    <ul className={styles.groups}>
                      {(day.grupos || []).map((group) => (
                        <li key={group}>{group}</li>
                      ))}
                    </ul>
                    <span className={styles.topic}>{day.tema}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className={styles.closing} aria-labelledby="junta-title">
        <div>
          <p className={styles.sectionScript}>Cierre de aniversario</p>
          <h2 id="junta-title">Junta Pública de Información</h2>
          <p className={styles.closingDate}>{fechas.junta_publica}</p>
          <p>{fechas.sede}</p>
          <p>
            La Conciencia del Grupo agradece de corazón a los grupos, mesas, servidores y familias
            que hacen posibles estos días de unidad.
          </p>
        </div>

        <div className={styles.closingContact}>
          <span>Informes</span>
          <strong>{contacto.nombre}</strong>
          {contacto.telefono_href ? (
            <a href={`tel:${contacto.telefono_href}`}>
              <PhoneIcon /> {contacto.telefono}
            </a>
          ) : null}
        </div>
      </section>

      <p className={styles.footerNote}>Unidad · Servicio · Recuperación</p>
    </div>
  )
}

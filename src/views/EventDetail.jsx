import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import FullScreenImage from '../components/ui/FullScreenImage'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import { mediaUrl } from '../utils/links'
import { renderRichText } from '../utils/richText'
import styles from './EventDetail.module.css'

function formatJunta(value) {
  if (value === 'true' || value === true) return 'Sí'
  if (value === 'false' || value === false) return 'No'
  return value || '—'
}

function DiaAgenda({ dia }) {
  const esJunta = dia.es_junta_publica === 'true' || dia.es_junta_publica === true
  const [, mes, diaNum] = String(dia.fecha || '').split('-')
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const mesNombre = mes ? MESES[Number(mes) - 1] || mes : ''
  const gruposLista = Array.isArray(dia.grupos)
    ? dia.grupos
    : String(dia.grupos || '').split(',').map((g) => g.trim()).filter(Boolean)

  return (
    <div className={`${styles.day} ${esJunta ? styles.dayJunta : ''}`}>
      <div className={styles.dayDate}>
        <span className={styles.weekday}>{dia.dia}</span>
        <span className={styles.dayNumber}>{dia.numero}</span>
        {mesNombre && <span className={styles.month}>{mesNombre}</span>}
      </div>
      <div className={styles.dayBody}>
        {dia.tema && <span className={styles.topic}>{dia.tema}</span>}
        {gruposLista.length > 0 && (
          <ul className={styles.groups}>
            {gruposLista.map((g, gi) => (
              <li key={gi}>{g}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function AniversarioInfo({ evento }) {
  const a = evento.aniversario || {}

  return (
    <>
      <div className={styles.block}>
        <div className={styles.blockHead}>
          <h3>Información del aniversario</h3>
          {a.kicker && (
            <span className="uppercase tracking-wide text-[0.68rem] font-bold text-slate-500 dark:text-slate-400">
              {a.kicker}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {a.epigrafe && (
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-[0.62rem] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                Epígrafe
              </p>
              <p className="text-sm text-slate-900 dark:text-slate-100">{a.epigrafe}</p>
            </div>
          )}
          {a.sede && (
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-[0.62rem] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                Sede
              </p>
              <p className="text-sm text-slate-900 dark:text-slate-100">{a.sede}</p>
            </div>
          )}
          {a.dias_unidad && (
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-[0.62rem] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                Días de unidad
              </p>
              <p className="text-sm text-slate-900 dark:text-slate-100">{a.dias_unidad}</p>
            </div>
          )}
          {a.junta_publica != null && (
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-[0.62rem] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                Junta pública
              </p>
              <p className="text-sm text-slate-900 dark:text-slate-100">{formatJunta(a.junta_publica)}</p>
            </div>
          )}
          {a.contacto_nombre && (
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-[0.62rem] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                Contacto
              </p>
              <p className="text-sm text-slate-900 dark:text-slate-100">{a.contacto_nombre}</p>
            </div>
          )}
          {a.contacto_telefono && (
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-[0.62rem] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                Teléfono
              </p>
              <p className="text-sm text-slate-900 dark:text-slate-100">{a.contacto_telefono}</p>
            </div>
          )}
        </div>
      </div>

      {a.frase_reflexion && <div className={styles.quote}>{a.frase_reflexion}</div>}

      {Array.isArray(a.dias) && a.dias.length > 0 && (
        <div className={styles.sectionBlock}>
          <h2>Agenda de días</h2>
          <div className={styles.days}>
            {a.dias.map((dia, index) => (
              <DiaAgenda key={index} dia={dia} />
            ))}
          </div>
        </div>
      )}

      {(a.contacto_nombre || a.contacto_telefono) && (
        <div className={styles.closing}>
          <div>
            <h2>Contáctanos</h2>
            <p className="mt-2">
              ¿Tienes dudas sobre esta actividad? Comunícate con nosotros:
            </p>
          </div>
          <div className={styles.closingContact}>
            {a.contacto_nombre && (
              <>
                <span>Contacto</span>
                <strong>{a.contacto_nombre}</strong>
              </>
            )}
            {a.contacto_telefono && (
              <>
                <span>Teléfono</span>
                <strong>{a.contacto_telefono}</strong>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default function EventDetail() {
  const { slug = '' } = useParams()
  const cleanSlug = slug.replace(/\.php$/i, '')

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(Boolean(cleanSlug) && cleanSlug !== 'invitacion_37178')

  useEffect(() => {
    if (!cleanSlug || cleanSlug === 'invitacion_37178') {
      return undefined
    }

    let active = true

    api
      .getEventDetail(cleanSlug)
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
  }, [cleanSlug])

  useDocumentTitle(event?.titulo || (loading ? 'Cargando evento...' : 'Evento'))

  if (cleanSlug === 'invitacion_37178') {
    return <Navigate to="/pages/eventos/invitacion_37178.php" replace />
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Cargando evento desde el API...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Eventos', to: '/pages/info/eventos.php' }, { label: 'Evento no encontrado' }]} />
        <div className={styles.panel}>
          <h1 className={styles.title}>Evento no encontrado</h1>
          <p className={styles.lead}>
            La publicación solicitada no existe o ya no está disponible.
          </p>
          <div className={styles.ctaRow}>
            <Link className={styles.primaryButton} to="/pages/info/eventos.php">
              Ver todos los eventos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const esAniversario = event.tipo === 'aniversario' && Boolean(event.aniversario)
  const descripcionHtml = renderRichText(event.descripcion)

  return (
    <div className={styles.page}>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Eventos', to: '/pages/info/eventos.php' },
          { label: event.titulo },
        ]}
      />

      <Link className={styles.backLink} to="/pages/info/eventos.php">
        ← Volver a eventos
      </Link>

      <article className={styles.article}>
        <header className={styles.detailHeader}>
          <span className={styles.eyebrow}>Evento</span>
          <h1 className={styles.articleTitle}>{event.titulo}</h1>
          {event.subtitulo ? <p className={styles.articleSubtitle}>{event.subtitulo}</p> : null}
        </header>

        <div className={styles.imageFrame}>
          <FullScreenImage
            src={mediaUrl(event)}
            alt={event.alt || event.titulo}
            onError={(imageEvent) => {
              imageEvent.currentTarget.style.visibility = 'hidden'
            }}
          />
        </div>

        <div className={styles.prose} dangerouslySetInnerHTML={{ __html: descripcionHtml }} />

        {esAniversario && <AniversarioInfo evento={event} />}

        <div className={styles.footerNote}>
          <span>{event.pie}</span>
          <Link className={styles.secondaryButton} to="/pages/info/eventos.php">
            Ver más eventos
          </Link>
        </div>
      </article>
    </div>
  )
}

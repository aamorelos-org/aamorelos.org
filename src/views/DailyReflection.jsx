import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import styles from './Reflections.module.css'
import dailyStyles from './DailyReflection.module.css'
import { parseBookAnnotation } from '../utils/annotation'

function todayMMDD() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const WEEKDAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

function formatMMDD(year, month, day) {
  return `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatFechaHumana(mmdd) {
  const match = /^(\d{2})-(\d{2})$/.exec(String(mmdd || ''))
  if (!match) {
    return mmdd || ''
  }
  const month = Number(match[1])
  const day = Number(match[2])
  const year = new Date().getFullYear()
  const daysInMonth = new Date(year, month, 0).getDate()
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth) {
    return mmdd
  }
  return `${day} de ${MONTHS[month - 1]}`
}

function splitIntoBlocks(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
}

// El campo "md" puede traer varios archivos separados por ';'
// (ej. "page_121.md;page_122.md"). Se limpian espacios y entradas vacías.
function splitMdFiles(md) {
  return String(md || '')
    .split(';')
    .map((file) => file.trim())
    .filter(Boolean)
}

function buildMdUrl(libro, file) {
  return `https://images.aamorelos.org/libros_anotados/${encodeURIComponent(libro)}/${encodeURIComponent(file)}`
}

function DocumentacionAnotada({ raw }) {
  let parsed
  let listaHit
  try {
    parsed = parseBookAnnotation(raw)
    listaHit = new Set(Object.values(parsed.matches).flat())
  } catch (error) {
    // Si el parser falla, mostramos el contenido crudo como fallback
    return <pre className={dailyStyles.mdFallback}>{String(raw || '')}</pre>
  }

  return (
    <div className={dailyStyles.mdContent}>
      {parsed.visible.map(({ index, text }) => {
        const hit = listaHit.has(index)
        return (
          <div key={index} className={`${dailyStyles.mdLine} ${hit ? dailyStyles.mdLineHit : ''}`}>
            <span className={dailyStyles.mdLineNo}>{index}</span>
            <span className={dailyStyles.mdLineText}>{text}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function DailyReflection() {
  useDocumentTitle('Reflexión del día')

  const [fecha, setFecha] = useState(todayMMDD)
  const [viewDate, setViewDate] = useState(() => new Date())
  const [reflexion, setReflexion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryTick, setRetryTick] = useState(0)
  const [viewer, setViewer] = useState({ open: false, loading: false, docs: [] })
  const closeButtonRef = useRef(null)
  const citaButtonRef = useRef(null)

  const viewYear = viewDate.getFullYear()
  const viewMonth = viewDate.getMonth()

  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    return [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
  }, [viewYear, viewMonth])

  const todayStr = todayMMDD()

  useEffect(() => {
    let active = true
    setLoading(true)

    api
      .getReflexionDiaria(fecha)
      .then((response) => {
        if (active) {
          const list = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : [])
          setReflexion(list[0] || null)
          setLoadError('')
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setReflexion(null)
          setLoadError('No se pudo cargar la reflexión del día. Intenta recargar la página.')
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [fecha, retryTick])

  const handlePickDay = (day) => {
    setFecha(formatMMDD(viewYear, viewMonth, day))
  }

  const moveMonth = (direction) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1))
  }

  const goToday = () => {
    const now = new Date()
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1))
    setFecha(`${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`)
  }

  const changeDay = (offset) => {
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
    const [month, day] = fecha.split('-').map(Number)
    next.setMonth(month - 1, day + offset)
    setViewDate(new Date(next.getFullYear(), next.getMonth(), 1))
    setFecha(formatMMDD(next.getFullYear(), next.getMonth(), next.getDate()))
  }

  const retryLoad = () => {
    setRetryTick((tick) => tick + 1)
  }

  const closeModal = () => {
    setViewer((prev) => ({ ...prev, open: false }))
    citaButtonRef.current?.focus()
  }

  const openModal = () => {
    const files = splitMdFiles(reflexion?.md)
    const libro = reflexion?.libro

    if (!libro || files.length === 0) {
      return
    }

    setViewer({ open: true, loading: true, docs: [] })

    Promise.allSettled(
      files.map(async (file) => {
        const url = buildMdUrl(libro, file)
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        return { file, url, content: await response.text() }
      }),
    ).then((results) => {
      setViewer((prev) => {
        if (!prev.open) {
          return prev
        }

        const docs = results.map((result, index) => {
          const file = files[index]
          const url = buildMdUrl(libro, file)

          if (result.status === 'fulfilled') {
            return { ...result.value, ok: true }
          }

          const reason = result.reason instanceof Error ? result.reason.message : String(result.reason)
          return { file, url, ok: false, error: reason }
        })

        return { open: true, loading: false, docs }
      })
    })
  }

  useEffect(() => {
    if (!viewer.open) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setViewer((prev) => ({ ...prev, open: false }))
        citaButtonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [viewer.open])

  const textoBlocks = splitIntoBlocks(reflexion?.texto)
  const contenidoBlocks = splitIntoBlocks(reflexion?.contenido)
  const mdFiles = splitMdFiles(reflexion?.md)
  const canViewSource = Boolean(reflexion?.libro) && mdFiles.length > 0

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Reflexiones', to: '/reflexiones' }, { label: 'Reflexión del día' }]} />

      <div className={styles.warmPage}>
        <div className={dailyStyles.dailyModule}>
          <div className={styles.detailBody} aria-live="polite">
            {loading ? (
              <p className={dailyStyles.empty}>Cargando reflexión del día...</p>
            ) : loadError ? (
              <div className={dailyStyles.empty}>
                <p>{loadError}</p>
                <p>
                  <button type="button" className={dailyStyles.actionBtn} onClick={retryLoad}>
                    Reintentar
                  </button>
                </p>
              </div>
            ) : !reflexion ? (
              <div className={dailyStyles.empty}>
                <p>No hay reflexión diaria para el {formatFechaHumana(fecha)}.</p>
                <p>
                  <Link to="/reflexiones">Ver todas las reflexiones</Link>
                </p>
              </div>
            ) : (
              <>
                <h2 className={styles.detailTitle}>{reflexion.titulo}</h2>
                <span className={styles.kicker}>Reflexión diaria · {formatFechaHumana(reflexion.fecha || fecha)}</span>
                <div className={dailyStyles.dayNav}>
                  <button type="button" className={dailyStyles.dayBtn} onClick={() => changeDay(-1)} aria-label="Día anterior">
                    ← Anterior
                  </button>
                  <button type="button" className={dailyStyles.dayBtn} onClick={goToday} aria-label="Ir a hoy">
                    Hoy
                  </button>
                  <button type="button" className={dailyStyles.dayBtn} onClick={() => changeDay(1)} aria-label="Día siguiente">
                    Siguiente →
                  </button>
                </div>
                {textoBlocks.length > 0 ? (
                  <div className={styles.articleBody}>
                    {textoBlocks.map((block, index) => (
                      <p key={index}>{block}</p>
                    ))}
                  </div>
                ) : null}
                {reflexion.cita ? (
                  canViewSource ? (
                    <button
                      type="button"
                      ref={citaButtonRef}
                      className={`${styles.quoteBox} ${dailyStyles.citaButton}`}
                      onClick={openModal}
                      aria-haspopup="dialog"
                      title="Ver página del libro"
                    >
                      <span className={dailyStyles.citaQuote}>«{reflexion.cita}»</span>
                      <span className={dailyStyles.citaHint}>Ver {mdFiles.length > 1 ? `las ${mdFiles.length} páginas` : 'la página'} del libro ↗</span>
                    </button>
                  ) : (
                    <blockquote className={styles.quoteBox}>«{reflexion.cita}»</blockquote>
                  )
                ) : null}
                {contenidoBlocks.length > 0 ? (
                  <div className={styles.articleBody}>
                    {contenidoBlocks.map((block, index) => (
                      <p key={index}>{block}</p>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>

          <aside className={dailyStyles.dateCard}>
            <div className={dailyStyles.calendar} aria-label="Calendario de reflexiones">
              <div className={dailyStyles.calHeader}>
                <button type="button" className={dailyStyles.calNav} onClick={() => moveMonth(-1)} aria-label="Mes anterior">
                  ←
                </button>
                <span>{MONTHS[viewMonth]} {viewYear}</span>
                <button type="button" className={dailyStyles.calNav} onClick={() => moveMonth(1)} aria-label="Mes siguiente">
                  →
                </button>
              </div>
              <div className={dailyStyles.calActions}>
                <button type="button" className={dailyStyles.actionBtn} onClick={goToday}>
                  Hoy
                </button>
              </div>
              <div className={dailyStyles.calGrid}>
                {WEEKDAYS.map((day, index) => (
                  <span key={index} className={dailyStyles.calWeekday}>{day}</span>
                ))}
                {cells.map((day, index) => {
                  if (day === null) {
                    return <span key={`blank-${index}`} className={dailyStyles.calBlank} />
                  }
                  const value = formatMMDD(viewYear, viewMonth, day)
                  const isSelected = value === fecha
                  const isToday = value === todayStr
                  return (
                    <button
                      key={day}
                      type="button"
                      className={`${dailyStyles.calDay} ${isSelected ? dailyStyles.calSelected : ''} ${isToday ? dailyStyles.calToday : ''}`}
                      onClick={() => handlePickDay(day)}
                      aria-pressed={isSelected}
                      aria-label={`Ver reflexión del ${value}`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {viewer.open ? (
        <div className={dailyStyles.modalOverlay} role="presentation" onClick={closeModal}>
          <div
            className={dailyStyles.modal}
            role="dialog"
            aria-modal="true"
            aria-label="Página del libro"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={dailyStyles.modalHeader}>
              <div className={dailyStyles.modalHeading}>
                <span className={styles.kicker}>Fuente del texto</span>
                <h3 className={dailyStyles.modalTitle}>{reflexion?.cita}</h3>
              </div>
              <button
                type="button"
                ref={closeButtonRef}
                className={dailyStyles.modalClose}
                onClick={closeModal}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className={dailyStyles.modalBody} aria-live="polite">
              {viewer.loading ? (
                <p className={dailyStyles.modalStatus}>Cargando contenido…</p>
              ) : (
                viewer.docs.map((doc) => (
                  <section key={doc.file} className={dailyStyles.mdSection}>
                    <div className={dailyStyles.mdSectionHeader}>
                      <span className={dailyStyles.mdFile}>{doc.file}</span>
                      <a className={dailyStyles.mdLink} href={doc.url} target="_blank" rel="noreferrer">
                        Abrir archivo ↗
                      </a>
                    </div>
                    {doc.ok ? (
                      <DocumentacionAnotada raw={doc.content} />
                    ) : (
                      <p className={dailyStyles.mdError}>
                        No se pudo cargar el archivo ({doc.error}). Usa “Abrir archivo” para verlo directamente.
                      </p>
                    )}
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

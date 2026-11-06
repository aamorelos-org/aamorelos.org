import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import pageStyles from './Page.module.css'
import styles from './Reflections.module.css'
import dailyStyles from './DailyReflection.module.css'

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
  if (month < 1 || month > 12 || day < 1) {
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

export default function DailyReflection() {
  useDocumentTitle('Reflexión del día')

  const [fecha, setFecha] = useState(todayMMDD)
  const [viewDate, setViewDate] = useState(() => new Date())
  const [reflexion, setReflexion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

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
  }, [fecha])

  const handlePickDay = (day) => {
    setFecha(formatMMDD(viewYear, viewMonth, day))
  }

  const moveMonth = (direction) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1))
  }

  const textoBlocks = splitIntoBlocks(reflexion?.texto)
  const contenidoBlocks = splitIntoBlocks(reflexion?.contenido)

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Reflexiones', to: '/reflexiones' }, { label: 'Reflexión del día' }]} />

      <div className={styles.warmPage}>
        <div className={dailyStyles.dailyModule}>
          <div className={styles.detailBody}>
            {loading ? (
              <p className={dailyStyles.empty}>Cargando reflexión del día...</p>
            ) : loadError ? (
              <p className={dailyStyles.empty}>{loadError}</p>
            ) : !reflexion ? (
              <div className={dailyStyles.empty}>
                <p>No hay reflexión diaria para el {fecha}.</p>
                <p>
                  <Link to="/reflexiones">Ver todas las reflexiones</Link>
                </p>
              </div>
            ) : (
              <>
                <h2 className={styles.detailTitle}>{reflexion.titulo}</h2>
                <span className={styles.kicker}>Reflexión diaria · {formatFechaHumana(reflexion.fecha)}</span>
                {textoBlocks.length > 0 ? (
                  <div className={styles.articleBody}>
                    {textoBlocks.map((block, index) => (
                      <p key={index}>{block}</p>
                    ))}
                  </div>
                ) : null}
                {contenidoBlocks.length > 0 ? (
                  <div className={styles.articleBody}>
                    {contenidoBlocks.map((block, index) => (
                      <p key={index}>{block}</p>
                    ))}
                  </div>
                ) : null}
                {reflexion.cita ? (
                  <blockquote className={styles.quoteBox}>«{reflexion.cita}»</blockquote>
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
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { api } from '../../services/api'
import { extractList } from './extractList'
import PanelHeader from './PanelHeader'

function eventTitle(event) {
  return event?.title || event?.titulo || event?.name || 'Evento sin título'
}

function eventDetail(event) {
  return event?.subtitle || event?.detalle || event?.description || event?.descripcion || ''
}

function eventDate(event) {
  return event?.date || event?.fecha || event?.datetime || ''
}

function eventLocation(event) {
  return event?.location || event?.lugar || event?.venue || ''
}

export default function EventsPanel() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadEvents = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.getEvents()
      setEvents(extractList(response))
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los eventos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  return (
    <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-labelledby="admin-events-title">
      <PanelHeader
        title="Eventos"
        headingId="admin-events-title"
        onRefresh={loadEvents}
        loading={loading}
      />

      {error ? (
        <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {loading && events.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center text-sm text-slate-500 dark:text-slate-400">Cargando eventos…</div>
      ) : null}

      {!loading && events.length === 0 && !error ? (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No hay eventos registrados.
        </div>
      ) : null}

      {events.length > 0 ? (
        <ul className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {events.map((event, index) => {
            const detail = eventDetail(event)
            const date = eventDate(event)
            const location = eventLocation(event)
            const meta = [date ? `Fecha: ${date}` : null, location ? `Lugar: ${location}` : null].filter(Boolean).join(' · ')

            return (
              <li key={event?.id || event?.slug || event?.title || index} className="flex flex-col gap-1 bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                <h3 className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">{eventTitle(event)}</h3>
                {meta ? <p className="text-xs text-slate-500 dark:text-slate-400">{meta}</p> : null}
                {detail ? <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{detail}</p> : null}
              </li>
            )
          })}
        </ul>
      ) : null}
    </section>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { eventLink } from '../../utils/links'
import { extractList } from './extractList'
import EventForm from './EventForm'
import Modal from './Modal'
import PanelHeader from './PanelHeader'

function eventTitle(event) {
  return event?.titulo || 'Evento sin título'
}

function eventDetail(event) {
  return event?.subtitulo || ''
}

function eventDate(event) {
  return event?.date || event?.fecha || event?.datetime || ''
}

function eventLocation(event) {
  return event?.location || event?.lugar || event?.venue || ''
}

function eventTipo(event) {
  return String(event?.tipo || '').trim()
}

export default function EventsPanel() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('access_token') : ''

  const loadEvents = useCallback(async () => {
    setLoading(true)
    setListError('')

    try {
      // El admin muestra la lista completa: pedir el máximo permitido.
      const response = await api.getEvents({ skip: 0, limit: 500 })
      setEvents(extractList(response))
    } catch (err) {
      setListError(err.message || 'No se pudieron cargar los eventos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const handleCreated = useCallback(async () => {
    setIsFormOpen(false)
    setSuccessMessage('Evento registrado correctamente.')
    await loadEvents()
  }, [loadEvents])

  useEffect(() => {
    if (!successMessage) {
      return undefined
    }

    const timer = window.setTimeout(() => setSuccessMessage(''), 5000)
    return () => window.clearTimeout(timer)
  }, [successMessage])

  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5" aria-labelledby="admin-events-title">
      <PanelHeader
        title="Eventos"
        headingId="admin-events-title"
        onRefresh={loadEvents}
        loading={loading}
      />

      {successMessage ? (
        <div role="status" className="mt-4 flex items-center justify-between gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            aria-label="Cerrar aviso"
            className="rounded p-1 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:hover:bg-emerald-900/40"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      ) : null}

      {!token ? (
        <div role="alert" className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          No hay un token activo. Cierra sesión y vuelve a iniciar para registrar eventos.
        </div>
      ) : null}

      {listError ? (
        <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {listError}
        </div>
      ) : null}

      <div className="mt-4">
        {loading && events.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center text-sm text-slate-500 dark:text-slate-400">Cargando eventos…</div>
        ) : null}

        {!loading && events.length === 0 && !listError ? (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No hay eventos registrados.
          </div>
        ) : null}

        {events.length > 0 ? (
          <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {events.map((event, index) => {
              const detail = eventDetail(event)
              const date = eventDate(event)
              const location = eventLocation(event)
              const tipo = eventTipo(event)
              const meta = [date ? `Fecha: ${date}` : null, location ? `Lugar: ${location}` : null].filter(Boolean).join(' · ')
              const link = eventLink(event)

              return (
                <li key={event?.id || event?.slogan || event?.titulo || index} className="flex flex-col gap-1 bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">{eventTitle(event)}</h3>
                    {tipo ? (
                      <span className="rounded-full border border-slate-300 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-600 dark:text-slate-300">
                        {tipo}
                      </span>
                    ) : null}
                  </div>
                  {link.to !== '#' ? (
                    link.external ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all font-mono text-[11px] text-purple-700 hover:underline dark:text-purple-300"
                      >
                        {link.to}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="break-all font-mono text-[11px] text-purple-700 hover:underline dark:text-purple-300"
                      >
                        {link.to}
                      </Link>
                    )
                  ) : null}
                  {meta ? <p className="text-xs text-slate-500 dark:text-slate-400">{meta}</p> : null}
                  {detail ? <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{detail}</p> : null}
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          disabled={!token}
          className="w-full rounded-md bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-purple-500 dark:hover:bg-purple-400 sm:w-auto"
        >
          Registrar nuevo evento
        </button>
      </div>

      {isFormOpen ? (
        <Modal title="Registrar nuevo evento" onClose={() => setIsFormOpen(false)}>
          <EventForm
            onClose={() => setIsFormOpen(false)}
            onCreated={handleCreated}
          />
        </Modal>
      ) : null}
    </section>
  )
}

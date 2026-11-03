import { useCallback, useEffect, useState } from 'react'
import { api } from '../../services/api'
import { extractList } from './extractList'
import PanelHeader from './PanelHeader'
import ReflectionsList from './ReflectionsList'
import ReflectionForm from './ReflectionForm'
import Modal from './Modal'

export default function ReflectionsPanel() {
  const [reflections, setReflections] = useState([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('access_token') : ''

  const loadReflections = useCallback(async () => {
    setLoading(true)
    setListError('')

    try {
      const response = await api.getReflections()
      setReflections(extractList(response))
    } catch (err) {
      setListError(err.message || 'No se pudieron cargar las reflexiones.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReflections()
  }, [loadReflections])

  const handleCreated = useCallback(async () => {
    setIsFormOpen(false)
    setSuccessMessage('Reflexión registrada correctamente.')
    await loadReflections()
  }, [loadReflections])

  useEffect(() => {
    if (!successMessage) {
      return undefined
    }

    const timer = window.setTimeout(() => setSuccessMessage(''), 5000)
    return () => window.clearTimeout(timer)
  }, [successMessage])

  return (
    <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-labelledby="admin-reflections-title">
      <PanelHeader
        title="Reflexiones"
        headingId="admin-reflections-title"
        onRefresh={loadReflections}
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
          No hay un token activo. Cierra sesión y vuelve a iniciar para registrar reflexiones.
        </div>
      ) : null}

      {listError ? (
        <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {listError}
        </div>
      ) : null}

      <div className="mt-4">
        <ReflectionsList
          items={reflections}
          loading={loading}
          hasError={Boolean(listError)}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          disabled={!token}
          className="rounded-md bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-purple-500 dark:hover:bg-purple-400"
        >
          Registrar nueva reflexión
        </button>
      </div>

      {isFormOpen ? (
        <Modal title="Registrar nueva reflexión" onClose={() => setIsFormOpen(false)}>
          <ReflectionForm
            onClose={() => setIsFormOpen(false)}
            onCreated={handleCreated}
          />
        </Modal>
      ) : null}
    </section>
  )
}

import { useNavigate } from 'react-router-dom'

export default function AdminHeader() {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/login')
  }

  return (
    <header className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mb-6 sm:gap-4 sm:p-5 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="text-sm text-slate-600 dark:text-slate-400">Gestiona los eventos y reflexiones del Área Morelos.</p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-md bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-400 sm:w-fit"
      >
        Cerrar Sesión
      </button>
    </header>
  )
}

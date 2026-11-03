import { useNavigate } from 'react-router-dom'

export default function AdminHeader() {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/login')
  }

  return (
    <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-700 dark:text-purple-300">Panel protegido</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome admin</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Gestiona los eventos y reflexiones del Área Morelos.</p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="w-fit rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-400"
      >
        Cerrar Sesión
      </button>
    </header>
  )
}

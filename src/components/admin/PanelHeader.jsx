export default function PanelHeader({ title, headingId, onRefresh, loading }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 id={headingId} className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        {loading ? 'Actualizando…' : 'Actualizar'}
      </button>
    </div>
  )
}

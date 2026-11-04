import { useEffect, useMemo, useState } from 'react'
import Pagination from '../ui/Pagination'
import { matchesRecord } from '../../utils/text'

const PAGE_SIZE = 20

export default function ReflectionsList({ items, loading, hasError }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [query])

  const filtered = useMemo(
    () => items.filter((reflection) => matchesRecord(reflection, query)),
    [items, query],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)
  const from = filtered.length === 0 ? 0 : start + 1
  const to = Math.min(start + PAGE_SIZE, filtered.length)

  const showLoading = loading && items.length === 0
  const showEmpty = !loading && visible.length === 0 && !hasError

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="reflections-search" className="sr-only">Buscar reflexiones</label>
        <input
          id="reflections-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar reflexiones…"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:max-w-xs"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Mostrando <span className="font-semibold text-slate-700 dark:text-slate-200">{from}–{to}</span> de{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">{filtered.length}</span>
          {query.trim() ? ' resultados' : ''}
        </p>
      </div>

      <div className="mt-3 hidden overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
            <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-4 py-3">Slug</th>
                <th scope="col" className="px-4 py-3">Título</th>
                <th scope="col" className="px-4 py-3">Subtítulo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
              {showLoading ? (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">Cargando reflexiones…</td></tr>
              ) : null}

              {showEmpty ? (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  {query.trim() ? `Sin resultados para “${query.trim()}”.` : 'No hay reflexiones registradas.'}
                </td></tr>
              ) : null}

              {visible.map((reflection, index) => (
                <tr key={reflection?.id || reflection?.slogan || index} className="align-top hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <td className="max-w-44 px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">{reflection?.slogan || '—'}</td>
                  <td className="max-w-xs px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{reflection?.titulo || '—'}</td>
                  <td className="max-w-xs px-4 py-3 text-slate-600 dark:text-slate-300">{reflection?.subtitulo || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 md:hidden">
        {showLoading ? (
          <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Cargando reflexiones…</div>
        ) : null}

        {showEmpty ? (
          <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {query.trim() ? `Sin resultados para “${query.trim()}”.` : 'No hay reflexiones registradas.'}
          </div>
        ) : null}

        {visible.length > 0 ? (
          <ul className="grid gap-3">
            {visible.map((reflection, index) => (
              <li key={reflection?.id || reflection?.slogan || index} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="break-all font-mono text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{reflection?.slogan || '—'}</p>
                <h3 className="mt-1 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">{reflection?.titulo || '—'}</h3>
                {reflection?.subtitulo ? <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{reflection.subtitulo}</p> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
    </div>
  )
}

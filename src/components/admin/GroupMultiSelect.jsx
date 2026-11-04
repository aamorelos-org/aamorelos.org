import { useMemo, useState } from 'react'

export default function GroupMultiSelect({ value = [], onChange, groups = [], disabled, placeholder = 'Buscar grupo…' }) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  // value es un array de IDs (strings). Usamos id como llave única porque
  // hay grupos con el mismo nombre en municipios diferentes.
  const selected = new Set(value.map(String))

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return groups
    return groups.filter(
      (g) =>
        String(g.nombre || '').toLowerCase().includes(q) ||
        String(g.municipio || '').toLowerCase().includes(q)
    )
  }, [groups, search])

  const toggle = (group) => {
    if (disabled) return
    const id = String(group.id)
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange([...next])
  }

  const remove = (groupId) => {
    if (disabled) return
    const next = new Set(selected)
    next.delete(String(groupId))
    onChange([...next])
  }

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setIsOpen(true)
  }

  const toggleList = () => {
    if (disabled) return
    setIsOpen((prev) => !prev)
  }

  const selectedGroups = groups.filter((g) => selected.has(String(g.id)))

  return (
    <div className="w-full" role="combobox" aria-expanded={isOpen} aria-haspopup="listbox">
      {/* Chips de seleccionados */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {selectedGroups.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => remove(g.id)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-md border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-800 transition hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900"
          >
            <span>{g.nombre}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-3 w-3">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          role="combobox"
          aria-controls="group-multi-list"
          value={search}
          onChange={handleSearch}
          onFocus={toggleList}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          disabled={disabled}
          placeholder={placeholder}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
        />

        {isOpen && !disabled && (
          <div
            id="group-multi-list"
            role="listbox"
            className="mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-slate-300 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white z-10"
          >
            <div className="px-3 py-2">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Filtrar…"
                className="w-full text-sm text-slate-600 dark:text-slate-300 bg-transparent border-none focus:ring-0 placeholder-dark:text-slate-400"
              />
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <div className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400">
                  No se encontraron grupos.
                </div>
              ) : (
                filtered.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    role="option"
                    aria-selected={selected.has(String(g.id))}
                    onClick={() => toggle(g)}
                    className="flex items-center justify-between w-full px-3 py-2.5 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selected.has(String(g.id))}
                        readOnly
                        className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 dark:border-slate-600 dark:text-purple-500"
                      />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">{g.nombre}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">{g.municipio || '—'}</div>
                      </div>
                    </div>
                    {selected.has(String(g.id)) ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 text-purple-600 dark:text-purple-400">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : null}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {!disabled && selectedGroups.length > 0 && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {selectedGroups.length} grupo(s) seleccionado(s)
        </p>
      )}
    </div>
  )
}

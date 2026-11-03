import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import Pagination from '../components/ui/Pagination'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import { districtRoute } from '../utils/links'
import { matchesQuery } from '../utils/text'
import pageStyles from './Page.module.css'
import styles from './Listing.module.css'

const PAGE_SIZE = 15

export default function Districts() {
  useDocumentTitle('Directorio de distritos')

  const [districts, setDistricts] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [area, setArea] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let active = true

    Promise.all([
      api.getStateDistricts('17'),
      api.getStateGroups('17'),
    ])
      .then(([districtsRes, groupsRes]) => {
        if (active) {
          const districtList = Array.isArray(districtsRes?.data) ? districtsRes.data : (Array.isArray(districtsRes) ? districtsRes : [])
          const groupList = Array.isArray(groupsRes?.data) ? groupsRes.data : (Array.isArray(groupsRes) ? groupsRes : [])
          setDistricts(districtList)
          setGroups(groupList)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const groupCounts = useMemo(() => {
    return groups.reduce((counts, group) => {
      const key = String(group.district_id)
      counts.set(key, (counts.get(key) || 0) + 1)
      return counts
    }, new Map())
  }, [groups])

  const municipalities = useMemo(() => {
    return [...new Set(districts.map((d) => d.municipality || d.municipio).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, 'es'),
    )
  }, [districts])

  const areas = useMemo(() => {
    return [...new Set(districts.map((d) => d.area || d.area_id).filter(Boolean))].sort((a, b) =>
      String(a).localeCompare(String(b), 'es'),
    )
  }, [districts])

  const filtered = useMemo(() => {
    return districts.filter((district) => {
      const muni = district.municipality || district.municipio || ''
      const ar = district.area || district.area_id || ''
      const name = district.name || district.distrito || ''

      if (municipality && muni !== municipality) {
        return false
      }
      if (area && String(ar) !== String(area)) {
        return false
      }
      if (query) {
        const haystack = [name, muni, district.neighborhood || district.colonia, district.address || district.domicilio].join(' ')
        if (!matchesQuery(haystack, query)) {
          return false
        }
      }
      return true
    })
  }, [area, districts, municipality, query])

  useEffect(() => {
    setPage(1)
  }, [area, municipality, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const clearFilters = () => {
    setQuery('')
    setMunicipality('')
    setArea('')
  }

  return (
    <div className={pageStyles.page}>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Distritos' }]} />

      <header className={pageStyles.pageHeader}>
        <span className={pageStyles.eyebrow}>Organización de servicio</span>
        <h1 className={pageStyles.title}>Distritos del Área Morelos</h1>
        <p className={pageStyles.lead}>
          Los distritos agrupan a los grupos de una zona geográfica para coordinar el servicio y
          llevar el mensaje de recuperación a quien lo necesita.
        </p>
      </header>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{districts.length}</span>
          <span className={styles.statLabel}>Distritos</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{municipalities.length}</span>
          <span className={styles.statLabel}>Municipios</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{groups.length}</span>
          <span className={styles.statLabel}>Grupos registrados</span>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.field}>
          <label htmlFor="district-query">Buscar</label>
          <input
            id="district-query"
            className={styles.input}
            type="search"
            placeholder="Nombre, colonia o dirección"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="district-municipality">Municipio</label>
          <select
            id="district-municipality"
            className={styles.select}
            value={municipality}
            onChange={(event) => setMunicipality(event.target.value)}
          >
            <option value="">Todos</option>
            {municipalities.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="district-area">Área</label>
          <select
            id="district-area"
            className={styles.select}
            value={area}
            onChange={(event) => setArea(event.target.value)}
          >
            <option value="">Todas</option>
            {areas.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.buttonGhost} onClick={clearFilters}>
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className={styles.metaRow}>
        <span>
          Mostrando <span className={styles.metaStrong}>{visible.length}</span> de{' '}
          <span className={styles.metaStrong}>{filtered.length}</span> distritos
        </span>
        <span className={styles.mobileHint}>Desliza la tabla para ver todas las columnas.</span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Distrito</th>
              <th>Municipio</th>
              <th>Colonia</th>
              <th>Área</th>
              <th>Grupos</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className={styles.emptyCell}>
                  Cargando distritos desde el API...
                </td>
              </tr>
            ) : visible.length ? (
              visible.map((district) => {
                const dId = district.id || district.distrito_id
                const dName = district.name || district.distrito
                const dMuni = district.municipality || district.municipio
                const dNeigh = district.neighborhood || district.colonia
                const dArea = district.area || district.area_id

                return (
                  <tr key={dId}>
                    <td>
                      <Link to={districtRoute(dId)}>{dName}</Link>
                    </td>
                    <td>{dMuni || '—'}</td>
                    <td>{dNeigh || '—'}</td>
                    <td>{dArea || '—'}</td>
                    <td>{groupCounts.get(String(dId)) || 0}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={5} className={styles.emptyCell}>
                  No encontramos distritos con esos criterios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
    </div>
  )
}

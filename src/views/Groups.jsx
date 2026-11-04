import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import Pagination from '../components/ui/Pagination'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import { groupRoute, districtRoute } from '../utils/links'
import { matchesRecord } from '../utils/text'
import pageStyles from './Page.module.css'
import styles from './Listing.module.css'

const PAGE_SIZE = 20

export default function Groups() {
  useDocumentTitle('Directorio de grupos')

  const [rawGroups, setRawGroups] = useState([])
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [districtId, setDistrictId] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let active = true

    Promise.all([
      api.getStateGroups('17'),
      api.getStateDistricts('17'),
    ])
      .then(([groupsRes, districtsRes]) => {
        if (active) {
          const groupList = Array.isArray(groupsRes?.data) ? groupsRes.data : (Array.isArray(groupsRes) ? groupsRes : [])
          const districtList = Array.isArray(districtsRes?.data) ? districtsRes.data : (Array.isArray(districtsRes) ? districtsRes : [])
          setRawGroups(groupList)
          setDistricts(districtList)
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

  const districtNames = useMemo(() => {
    return new Map(districts.map((district) => [String(district.id), district.nombre]))
  }, [districts])

  const municipalities = useMemo(() => {
    return [...new Set(rawGroups.map((g) => g.municipio).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, 'es'),
    )
  }, [rawGroups])

  const types = useMemo(() => {
    return [...new Set(rawGroups.map((g) => g.tipo).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, 'es'),
    )
  }, [rawGroups])

  const filtered = useMemo(() => {
    return rawGroups.filter((group) => {
      const muni = group.municipio || ''
      const typ = group.tipo || ''
      const dist = String(group.distrito_id || '')

      if (municipality && muni !== municipality) {
        return false
      }
      if (districtId && dist !== districtId) {
        return false
      }
      if (type && typ !== type) {
        return false
      }
      if (query && !matchesRecord({ ...group, district: districtNames.get(dist) }, query)) {
        return false
      }
      return true
    })
  }, [districtId, districtNames, municipality, query, rawGroups, type])

  useEffect(() => {
    setPage(1)
  }, [districtId, municipality, query, type])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const clearFilters = () => {
    setQuery('')
    setMunicipality('')
    setDistrictId('')
    setType('')
  }

  return (
    <div className={pageStyles.page}>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Grupos' }]} />

      <header className={pageStyles.pageHeader}>
        <span className={pageStyles.eyebrow}>Directorio</span>
        <h1 className={pageStyles.title}>Grupos de Alcohólicos Anónimos</h1>
        <p className={pageStyles.lead}>
          Consulta los grupos del Área Morelos consumidos desde el API oficial. Puedes buscar por
          nombre, municipio, colonia o filtrar por distrito y tipo de reunión.
        </p>
      </header>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{rawGroups.length}</span>
          <span className={styles.statLabel}>Grupos registrados</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{municipalities.length}</span>
          <span className={styles.statLabel}>Municipios</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{districts.length}</span>
          <span className={styles.statLabel}>Distritos</span>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.field}>
          <label htmlFor="group-query">Buscar</label>
          <input
            id="group-query"
            className={styles.input}
            type="search"
            placeholder="Nombre, colonia o dirección"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="group-municipality">Municipio</label>
          <select
            id="group-municipality"
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
          <label htmlFor="group-district">Distrito</label>
          <select
            id="group-district"
            className={styles.select}
            value={districtId}
            onChange={(event) => setDistrictId(event.target.value)}
          >
            <option value="">Todos</option>
            {districts.map((district) => (
              <option key={district.id} value={String(district.id)}>{district.nombre}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="group-type">Tipo</label>
          <select
            id="group-type"
            className={styles.select}
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="">Todos</option>
            {types.map((item) => (
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
          <span className={styles.metaStrong}>{filtered.length}</span> grupos
        </span>
        <span className={styles.mobileHint}>Desliza la tabla para ver todas las columnas.</span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Distrito</th>
              <th>Municipio</th>
              <th>Colonia</th>
              <th>Tipo</th>
              <th>Género</th>
              <th>Idioma</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className={styles.emptyCell}>
                  Cargando grupos desde el API...
                </td>
              </tr>
            ) : visible.length ? (
              visible.map((group) => {
                const gId = group.id || group.id_grupo
                const gName = group.nombre || group.grupo
                const gDistId = group.distrito_id || group.distrito
                const gMuni = group.municipio
                const gNeigh = group.vecinos || group.colonia
                const gType = group.tipo
                const gGender = group.genero
                const gLang = group.lengua

                return (
                  <tr key={gId}>
                    <td>
                      <Link to={groupRoute(gId)}>{gName}</Link>
                    </td>
                    <td>
                      {gDistId ? (
                        <Link to={districtRoute(gDistId)}>
                          {districtNames.get(String(gDistId)) || 'Distrito'}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>{gMuni || '—'}</td>
                    <td>{gNeigh || '—'}</td>
                    <td>{gType || '—'}</td>
                    <td>{gGender || '—'}</td>
                    <td>{gLang || '—'}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className={styles.emptyCell}>
                  No encontramos grupos con esos criterios.
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

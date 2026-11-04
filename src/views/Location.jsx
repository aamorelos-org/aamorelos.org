import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import MapEmbed from '../components/ui/MapEmbed'
import Pagination from '../components/ui/Pagination'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import { site } from '../data/site'
import { districtRoute } from '../utils/links'
import { matchesRecord } from '../utils/text'
import pageStyles from './Page.module.css'
import styles from './Listing.module.css'

const PAGE_SIZE = 20

export default function Location() {
  useDocumentTitle('Ubicación y mapa de distritos')

  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let active = true

    api
      .getStateDistricts('17')
      .then((response) => {
        if (active) {
          const list = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : [])
          setDistricts(list)
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

  useEffect(() => {
    setPage(1)
  }, [query])

  const filtered = useMemo(
    () => districts.filter((district) => matchesRecord(district, query)),
    [districts, query],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)
  const from = filtered.length === 0 ? 0 : start + 1
  const to = Math.min(start + PAGE_SIZE, filtered.length)

  return (
    <div className={pageStyles.page}>
      <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Ubicación' }]} />

      <header className={pageStyles.pageHeader}>
        <span className={pageStyles.eyebrow}>Área Morelos</span>
        <h1 className={pageStyles.title}>Ubicación y mapa de distritos</h1>
        <p className={pageStyles.lead}>
          Visualiza la zona del Área Morelos o consulta el listado de distritos para ubicar el más
          cercano a tu domicilio.
        </p>
      </header>

      <div className={pageStyles.panel}>
        <MapEmbed query="Alcohólicos Anónimos Morelos" title="Mapa del Área Morelos" height={420} />
        <p className={pageStyles.lead} style={{ marginTop: 16 }}>
          El mapa es una referencia general. Para conocer la dirección exacta de un grupo, consulta
          su ficha en el directorio de grupos.
        </p>
      </div>

      <div className={pageStyles.grid2} style={{ marginTop: 28 }}>
        <section className={pageStyles.panel}>
          <h2 className={pageStyles.sectionBlock} style={{ marginTop: 0 }}>Listado de distritos</h2>
          <div className={styles.filters} style={{ marginBottom: 12 }}>
            <div className={styles.field}>
              <label htmlFor="district-query">Buscar</label>
              <input
                id="district-query"
                className={styles.input}
                type="search"
                placeholder="Nombre, municipio o zona"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
          <div className={styles.metaRow} style={{ marginBottom: 8 }}>
            <span>
              Mostrando <span className={styles.metaStrong}>{from}–{to}</span> de{' '}
              <span className={styles.metaStrong}>{filtered.length}</span> distritos
            </span>
          </div>
          <div className={styles.tableWrap} style={{ boxShadow: 'none' }}>
            <table className={styles.table} style={{ minWidth: 0 }}>
              <thead>
                <tr>
                  <th>Distrito</th>
                  <th>Municipio</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2} className={styles.emptyCell}>
                      Cargando distritos desde el API...
                    </td>
                  </tr>
                ) : visible.length ? (
                  visible.map((district) => (
                    <tr key={district.id}>
                      <td>
                        <Link to={districtRoute(district.id)}>{district.nombre}</Link>
                      </td>
                      <td>{district.municipio || '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className={styles.emptyCell}>
                      {query ? `Sin resultados para “${query}”.` : 'No se encontraron distritos.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
        </section>

        <aside className={pageStyles.asideCard}>
          <h2>Contacto del Área Morelos</h2>
          <p>
            Si necesitas orientación para encontrar un grupo o deseas información sobre
            Alcohólicos Anónimos, estamos para escucharte.
          </p>
          <ul className={pageStyles.contactList}>
            <li>
              <span className={pageStyles.metaLabel}>Teléfono</span>
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            </li>
            <li>
              <span className={pageStyles.metaLabel}>Correo</span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <span className={pageStyles.metaLabel}>Línea nacional</span>
              <a href="tel:+528002169231">{site.nationalPhone}</a>
            </li>
          </ul>
          <p className={pageStyles.notice}>
            La atención es confidencial y sin costo. El único requisito para ser miembro de A.A. es
            el deseo de dejar la bebida.
          </p>
        </aside>
      </div>
    </div>
  )
}

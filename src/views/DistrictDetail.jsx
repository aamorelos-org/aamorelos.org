import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import MapEmbed from '../components/ui/MapEmbed'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import { groupRoute } from '../utils/links'
import pageStyles from './Page.module.css'
import styles from './Detail.module.css'

export default function DistrictDetail() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') || ''

  const [district, setDistrict] = useState(null)
  const [districtGroups, setDistrictGroups] = useState([])
  const [loading, setLoading] = useState(Boolean(id))

  useEffect(() => {
    if (!id) {
      return undefined
    }

    let active = true

    Promise.all([
      api.getDistrictDetail(id),
      api.getDistrictGroups(id),
    ])
      .then(([districtRes, groupsRes]) => {
        if (!active) {
          return
        }

        const district = districtRes?.data || districtRes || null
        const groups = Array.isArray(groupsRes?.data) ? groupsRes.data : (Array.isArray(groupsRes) ? groupsRes : [])

        setDistrict(district)
        setDistrictGroups(groups)
        setLoading(false)
      })
      .catch(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [id])

  useDocumentTitle(district?.nombre || (loading ? 'Cargando distrito...' : 'Distrito no encontrado'))

  if (loading) {
    return (
      <div className={pageStyles.page}>
        <p>Cargando distrito desde el API...</p>
      </div>
    )
  }

  if (!district) {
    return (
      <div className={pageStyles.page}>
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Distritos', to: '/pages/distritos/distritos.php' }, { label: 'Distrito no encontrado' }]} />
        <div className={pageStyles.panel}>
          <h1 className={pageStyles.title}>Distrito no encontrado</h1>
          <p className={pageStyles.lead}>El distrito solicitado no existe o ya no está disponible.</p>
          <div className={pageStyles.ctaRow}>
            <Link className={pageStyles.primaryButton} to="/pages/distritos/distritos.php">
              Volver al directorio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const mapQuery = [district.direccion, district.vecinos, district.municipio, 'Morelos']
    .filter(Boolean)
    .join(', ')

  return (
    <div className={pageStyles.page}>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Distritos', to: '/pages/distritos/distritos.php' },
          { label: district.nombre },
        ]}
      />

      <Link className={pageStyles.backLink} to="/pages/distritos/distritos.php">
        ← Volver a distritos
      </Link>

      <div className={styles.layout}>
        <div className={styles.main}>
          <header className={pageStyles.detailHeader}>
            <span className={pageStyles.eyebrow}>Distrito · Área {district.area || 'Morelos'}</span>
            <h1 className={pageStyles.detailTitle}>{district.nombre}</h1>
            <div className={pageStyles.pillRow}>
              <span className={pageStyles.pill}>{districtGroups.length} grupos</span>
              {district.municipio ? <span className={pageStyles.pillNeutral + ' ' + pageStyles.pill}>{district.municipio}</span> : null}
            </div>
          </header>

          <section className={pageStyles.panel}>
            <h2>Información del distrito</h2>
            <ul className={styles.infoList}>
              <li className={styles.infoRow}>
                <span className={styles.infoLabel}>Área</span>
                <span className={styles.infoValue}>{district.area || 'No disponible'}</span>
              </li>
              <li className={styles.infoRow}>
                <span className={styles.infoLabel}>Municipio</span>
                <span className={styles.infoValue}>{district.municipio || 'No disponible'}</span>
              </li>
              <li className={styles.infoRow}>
                <span className={styles.infoLabel}>Colonia</span>
                <span className={styles.infoValue}>{district.vecinos || 'No disponible'}</span>
              </li>
              <li className={styles.infoRow}>
                <span className={styles.infoLabel}>Dirección</span>
                <span className={styles.infoValue}>{district.direccion || 'No disponible'}</span>
              </li>
              {district.referencia ? (
                <li className={styles.infoRow}>
                  <span className={styles.infoLabel}>Referencias</span>
                  <span className={styles.infoValue}>{district.referencia}</span>
                </li>
              ) : null}
              {district.telefono ? (
                <li className={styles.infoRow}>
                  <span className={styles.infoLabel}>Teléfono</span>
                  <span className={styles.infoValue}>
                    <a href={`tel:${String(district.telefono).replace(/\D/g, '')}`}>{district.telefono}</a>
                  </span>
                </li>
              ) : null}
            </ul>
          </section>

          <section className={pageStyles.panel}>
            <h2 className={pageStyles.sectionBlock} style={{ marginTop: 0 }}>Ubicación aproximada</h2>
            <MapEmbed query={mapQuery} title={`Mapa de ${district.nombre}`} height={340} />
          </section>
        </div>

        <aside className={styles.aside}>
          <div className={styles.card}>
            <h2>Grupos del distrito</h2>
            {districtGroups.length ? (
              <ul className={styles.groupList}>
                {districtGroups.map((group) => (
                  <li key={group.id || group.id_grupo}>
                    <Link to={groupRoute(group.id || group.id_grupo)}>
                      <span>{group.nombre || group.grupo}</span>
                      <span className={styles.groupMeta}>{group.municipio || ''}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.note}>No hay grupos registrados en este distrito.</p>
            )}
          </div>

          <div className={styles.card}>
            <h2>¿Necesitas orientación?</h2>
            <p className={styles.note}>
              Si deseas información para ti o para un ser querido, puedes comunicarte con el Área
              Morelos. La atención es confidencial y sin costo.
            </p>
            <div className={pageStyles.ctaRow} style={{ marginTop: 14 }}>
              <a className={pageStyles.primaryButton} href="tel:+527773090872">
                Llamar
              </a>
              <a className={pageStyles.secondaryButton} href="mailto:area28@aamexico.org.mx">
                Correo
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

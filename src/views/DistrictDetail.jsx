import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import MapEmbed from '../components/ui/MapEmbed'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api, isApiConfigured } from '../services/api'
import { groupRoute } from '../utils/links'
import districts from '../data/districts.json'
import allGroups from '../data/groups.json'
import pageStyles from './Page.module.css'
import styles from './Detail.module.css'

export default function DistrictDetail() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') || ''
  const district = districts.find((item) => String(item.id) === id)

  const localGroups = useMemo(
    () => allGroups.filter((group) => String(group.district_id) === id),
    [id],
  )

  const [districtGroups, setDistrictGroups] = useState(localGroups)

  useEffect(() => {
    setDistrictGroups(localGroups)

    if (!district || !isApiConfigured) {
      return undefined
    }

    let active = true

    api
      .getDistrictGroups(district.id)
      .then((response) => {
        if (active && Array.isArray(response?.data) && response.data.length) {
          setDistrictGroups(response.data)
        }
      })
      .catch(() => {
        // El directorio local sigue disponible si la API no responde.
      })

    return () => {
      active = false
    }
  }, [district, localGroups])

  useDocumentTitle(district?.name || 'Distrito no encontrado')

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

  const mapQuery = [district.address, district.neighborhood, district.municipality, 'Morelos']
    .filter(Boolean)
    .join(', ')

  return (
    <div className={pageStyles.page}>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Distritos', to: '/pages/distritos/distritos.php' },
          { label: district.name },
        ]}
      />

      <Link className={pageStyles.backLink} to="/pages/distritos/distritos.php">
        ← Volver a distritos
      </Link>

      <div className={styles.layout}>
        <div className={styles.main}>
          <header className={pageStyles.detailHeader}>
            <span className={pageStyles.eyebrow}>Distrito · Área {district.area || 'Morelos'}</span>
            <h1 className={pageStyles.detailTitle}>{district.name}</h1>
            <div className={pageStyles.pillRow}>
              <span className={pageStyles.pill}>{districtGroups.length} grupos</span>
              {district.municipality ? <span className={pageStyles.pillNeutral + ' ' + pageStyles.pill}>{district.municipality}</span> : null}
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
                <span className={styles.infoValue}>{district.municipality || 'No disponible'}</span>
              </li>
              <li className={styles.infoRow}>
                <span className={styles.infoLabel}>Colonia</span>
                <span className={styles.infoValue}>{district.neighborhood || 'No disponible'}</span>
              </li>
              <li className={styles.infoRow}>
                <span className={styles.infoLabel}>Dirección</span>
                <span className={styles.infoValue}>{district.address || 'No disponible'}</span>
              </li>
              {district.reference ? (
                <li className={styles.infoRow}>
                  <span className={styles.infoLabel}>Referencias</span>
                  <span className={styles.infoValue}>{district.reference}</span>
                </li>
              ) : null}
              {district.phone ? (
                <li className={styles.infoRow}>
                  <span className={styles.infoLabel}>Teléfono</span>
                  <span className={styles.infoValue}>
                    <a href={`tel:${String(district.phone).replace(/\D/g, '')}`}>{district.phone}</a>
                  </span>
                </li>
              ) : null}
            </ul>
          </section>

          <section className={pageStyles.panel}>
            <h2 className={pageStyles.sectionBlock} style={{ marginTop: 0 }}>Ubicación aproximada</h2>
            <MapEmbed query={mapQuery} title={`Mapa de ${district.name}`} height={340} />
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
                      <span>{group.name || group.grupo}</span>
                      <span className={styles.groupMeta}>{group.municipality || group.municipio || ''}</span>
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

import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import MapEmbed from '../components/ui/MapEmbed'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import { districtRoute, groupRoute } from '../utils/links'
import pageStyles from './Page.module.css'
import styles from './Detail.module.css'

const days = [
  ['Lunes', 'horario_lunes'],
  ['Martes', 'horario_martes'],
  ['Miércoles', 'horario_miercoles'],
  ['Jueves', 'horario_jueves'],
  ['Viernes', 'horario_viernes'],
  ['Sábado', 'horario_sabado'],
  ['Domingo', 'horario_domingo'],
]

export default function GroupDetail() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') || ''

  const [group, setGroup] = useState(null)
  const [districts, setDistricts] = useState([])
  const [allGroups, setAllGroups] = useState([])
  const [loading, setLoading] = useState(Boolean(id))

  useEffect(() => {
    if (!id) {
      return undefined
    }

    let active = true

    Promise.all([
      api.getGroupDetail(id, '17'),
      api.getStateDistricts('17'),
      api.getStateGroups('17'),
    ])
      .then(([groupRes, districtsRes, groupsRes]) => {
        if (!active) {
          return
        }

        const group = groupRes?.data || groupRes || null
        const districtList = Array.isArray(districtsRes?.data) ? districtsRes.data : (Array.isArray(districtsRes) ? districtsRes : [])
        const groups = Array.isArray(groupsRes?.data) ? groupsRes.data : (Array.isArray(groupsRes) ? groupsRes : [])

        setAllGroups(groups)
        setDistricts(districtList)
        setGroup(group)
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

  const district = group
    ? districts.find((item) => String(item.id) === String(group.distrito_id))
    : null

  useDocumentTitle(group?.nombre || (loading ? 'Cargando grupo...' : 'Grupo no encontrado'))

  if (loading) {
    return (
      <div className={pageStyles.page}>
        <p>Cargando grupo desde el API...</p>
      </div>
    )
  }

  if (!group) {
    return (
      <div className={pageStyles.page}>
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Grupos', to: '/pages/grupos/grupos.php' }, { label: 'Grupo no encontrado' }]} />
        <div className={pageStyles.panel}>
          <h1 className={pageStyles.title}>Grupo no encontrado</h1>
          <p className={pageStyles.lead}>El grupo solicitado no existe o ya no está disponible.</p>
          <div className={pageStyles.ctaRow}>
            <Link className={pageStyles.primaryButton} to="/pages/grupos/grupos.php">
              Volver al directorio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const activeDays = days
    .map(([label, key]) => ({ label, value: group[key] }))
    .filter((day) => String(day.value || '').trim() !== '')

  const mapQuery = group.latitud && group.longitud
    ? `${group.latitud},${group.longitud}`
    : [group.direccion, group.vecinos, group.municipio, 'Morelos'].filter(Boolean).join(', ')

  const related = allGroups
    .filter((item) => String(item.distrito_id) === String(group.distrito_id) && String(item.id) !== String(group.id))
    .slice(0, 6)

  return (
    <div className={pageStyles.page}>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Grupos', to: '/pages/grupos/grupos.php' },
          { label: group.nombre },
        ]}
      />

      <Link className={pageStyles.backLink} to="/pages/grupos/grupos.php">
        ← Volver a grupos
      </Link>

      <div className={styles.layout}>
        <div className={styles.main}>
          <header className={pageStyles.detailHeader}>
            <span className={pageStyles.eyebrow}>Grupo de Alcohólicos Anónimos</span>
            <h1 className={pageStyles.detailTitle}>{group.nombre}</h1>
            <div className={pageStyles.pillRow}>
              {group.tipo ? <span className={pageStyles.pill}>{group.tipo}</span> : null}
              {group.genero ? <span className={pageStyles.pillNeutral + ' ' + pageStyles.pill}>{group.genero}</span> : null}
              {group.lengua ? <span className={pageStyles.pillNeutral + ' ' + pageStyles.pill}>{group.lengua}</span> : null}
              <span className={pageStyles.pillNeutral + ' ' + pageStyles.pill}>
                {group.es_activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </header>

          <section className={pageStyles.panel}>
            <div className={styles.card} style={{ padding: 0, border: 0, boxShadow: 'none' }}>
              <h2>Información del grupo</h2>
              <ul className={styles.infoList}>
                <li className={styles.infoRow}>
                  <span className={styles.infoLabel}>Municipio</span>
                  <span className={styles.infoValue}>{group.municipio || 'No disponible'}</span>
                </li>
                <li className={styles.infoRow}>
                  <span className={styles.infoLabel}>Colonia</span>
                  <span className={styles.infoValue}>{group.vecinos || 'No disponible'}</span>
                </li>
                <li className={styles.infoRow}>
                  <span className={styles.infoLabel}>Dirección</span>
                  <span className={styles.infoValue}>{group.direccion || 'No disponible'}</span>
                </li>
                {group.referencias ? (
                  <li className={styles.infoRow}>
                    <span className={styles.infoLabel}>Referencias</span>
                    <span className={styles.infoValue}>{group.referencias}</span>
                  </li>
                ) : null}
                <li className={styles.infoRow}>
                  <span className={styles.infoLabel}>Distrito</span>
                  <span className={styles.infoValue}>
                    {district ? (
                      <Link to={districtRoute(district.id)}>{district.nombre}</Link>
                    ) : (
                      'No disponible'
                    )}
                  </span>
                </li>
                {group.fumar_texto ? (
                  <li className={styles.infoRow}>
                    <span className={styles.infoLabel}>Se fuma</span>
                    <span className={styles.infoValue}>{group.fumar_texto}</span>
                  </li>
                ) : null}
              </ul>
            </div>
          </section>

          <section className={pageStyles.panel}>
            <h2 className={pageStyles.sectionBlock} style={{ marginTop: 0 }}>Horarios de sesión</h2>
            {activeDays.length ? (
              <ul className={styles.scheduleList}>
                {activeDays.map((day) => (
                  <li className={styles.scheduleItem} key={day.label}>
                    <span className={styles.scheduleDay}>{day.label}</span>
                    <span className={styles.scheduleTime}>{day.value}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.note}>Sin horarios registrados. Te recomendamos comunicarte con el Área Morelos.</p>
            )}
            {group.horario_observacion ? (
              <p className={styles.note} style={{ marginTop: 14 }}>
                <strong>Observaciones:</strong> {group.horario_observacion}
              </p>
            ) : null}
          </section>

          <section className={pageStyles.panel}>
            <h2 className={pageStyles.sectionBlock} style={{ marginTop: 0 }}>Ubicación</h2>
            <MapEmbed query={mapQuery} title={`Mapa de ${group.nombre}`} height={340} />
          </section>
        </div>

        <aside className={styles.aside}>
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

          {related.length ? (
            <div className={styles.card}>
              <h2>Otros grupos del distrito</h2>
              <ul className={styles.groupList}>
                {related.map((item) => (
                  <li key={item.id}>
                    <Link to={groupRoute(item.id)}>
                      <span>{item.nombre}</span>
                      <span className={styles.groupMeta}>{item.municipio}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  )
}

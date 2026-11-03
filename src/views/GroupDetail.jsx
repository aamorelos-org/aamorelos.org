import { Link, useSearchParams } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import MapEmbed from '../components/ui/MapEmbed'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { districtRoute, groupRoute } from '../utils/links'
import groups from '../data/groups.json'
import districts from '../data/districts.json'
import pageStyles from './Page.module.css'
import styles from './Detail.module.css'

const days = [
  ['Lunes', 'schedule_monday'],
  ['Martes', 'schedule_tuesday'],
  ['Miércoles', 'schedule_wednesday'],
  ['Jueves', 'schedule_thursday'],
  ['Viernes', 'schedule_friday'],
  ['Sábado', 'schedule_saturday'],
  ['Domingo', 'schedule_sunday'],
]

export default function GroupDetail() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') || ''
  const group = groups.find((item) => String(item.id) === id)
  const district = group ? districts.find((item) => String(item.id) === String(group.district_id)) : null

  useDocumentTitle(group?.name || 'Grupo no encontrado')

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

  const mapQuery = group.latitude && group.longitude
    ? `${group.latitude},${group.longitude}`
    : [group.address, group.neighborhood, group.municipality, 'Morelos'].filter(Boolean).join(', ')

  const related = groups
    .filter((item) => String(item.district_id) === String(group.district_id) && String(item.id) !== String(group.id))
    .slice(0, 6)

  return (
    <div className={pageStyles.page}>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Grupos', to: '/pages/grupos/grupos.php' },
          { label: group.name },
        ]}
      />

      <Link className={pageStyles.backLink} to="/pages/grupos/grupos.php">
        ← Volver a grupos
      </Link>

      <div className={styles.layout}>
        <div className={styles.main}>
          <header className={pageStyles.detailHeader}>
            <span className={pageStyles.eyebrow}>Grupo de Alcohólicos Anónimos</span>
            <h1 className={pageStyles.detailTitle}>{group.name}</h1>
            <div className={pageStyles.pillRow}>
              {group.type ? <span className={pageStyles.pill}>{group.type}</span> : null}
              {group.gender ? <span className={pageStyles.pillNeutral + ' ' + pageStyles.pill}>{group.gender}</span> : null}
              {group.language ? <span className={pageStyles.pillNeutral + ' ' + pageStyles.pill}>{group.language}</span> : null}
              <span className={pageStyles.pillNeutral + ' ' + pageStyles.pill}>
                {group.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </header>

          <section className={pageStyles.panel}>
            <div className={styles.card} style={{ padding: 0, border: 0, boxShadow: 'none' }}>
              <h2>Información del grupo</h2>
              <ul className={styles.infoList}>
                <li className={styles.infoRow}>
                  <span className={styles.infoLabel}>Municipio</span>
                  <span className={styles.infoValue}>{group.municipality || 'No disponible'}</span>
                </li>
                <li className={styles.infoRow}>
                  <span className={styles.infoLabel}>Colonia</span>
                  <span className={styles.infoValue}>{group.neighborhood || 'No disponible'}</span>
                </li>
                <li className={styles.infoRow}>
                  <span className={styles.infoLabel}>Dirección</span>
                  <span className={styles.infoValue}>{group.address || 'No disponible'}</span>
                </li>
                {group.reference ? (
                  <li className={styles.infoRow}>
                    <span className={styles.infoLabel}>Referencias</span>
                    <span className={styles.infoValue}>{group.reference}</span>
                  </li>
                ) : null}
                <li className={styles.infoRow}>
                  <span className={styles.infoLabel}>Distrito</span>
                  <span className={styles.infoValue}>
                    {district ? (
                      <Link to={districtRoute(district.id)}>{district.name}</Link>
                    ) : (
                      'No disponible'
                    )}
                  </span>
                </li>
                {group.smoking_text ? (
                  <li className={styles.infoRow}>
                    <span className={styles.infoLabel}>Se fuma</span>
                    <span className={styles.infoValue}>{group.smoking_text}</span>
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
            {group.schedule_observation ? (
              <p className={styles.note} style={{ marginTop: 14 }}>
                <strong>Observaciones:</strong> {group.schedule_observation}
              </p>
            ) : null}
          </section>

          <section className={pageStyles.panel}>
            <h2 className={pageStyles.sectionBlock} style={{ marginTop: 0 }}>Ubicación</h2>
            <MapEmbed query={mapQuery} title={`Mapa de ${group.name}`} height={340} />
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
                      <span>{item.name}</span>
                      <span className={styles.groupMeta}>{item.municipality}</span>
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

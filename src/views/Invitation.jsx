import { Link } from 'react-router-dom'
import Breadcrumb from '../components/layout/Breadcrumb'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { invitationBlocks, invitationDays } from '../data/invitation'
import { assetUrl } from '../utils/links'
import styles from './Invitation.module.css'

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

export default function Invitation() {
  useDocumentTitle('16 Aniversario · Grupo Hoy Volvemos a Empezar')

  return (
    <div className={styles.page}>
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Eventos', to: '/pages/info/eventos.php' },
          { label: '16 Aniversario' },
        ]}
      />

      <Link className={styles.secondaryButton} to="/pages/info/eventos.php">
        ← Volver a eventos
      </Link>

      <section className={styles.hero} aria-labelledby="inv-title">
        <div className={styles.heroBody}>
          <span className={styles.eyebrow}>Central Mexicana de Servicios Generales de A.A., A.C. · 6° Distrito · Área Morelos</span>
          <h1 className={styles.title} id="inv-title">
            Grupo Hoy Volvemos a Empezar · 16 Aniversario
          </h1>
          <p className={styles.subtitle}>Atenta invitación</p>
          <p className={styles.lead}>
            La Conciencia del Grupo agradece de corazón a los grupos, mesas, servidores y familias
            que hacen posibles estos días de unidad, y extiende una cordial invitación a acompañarnos
            en la Junta Pública de Información.
          </p>

          <ul className={styles.metaList}>
            <li className={styles.metaItem}>
              <span className={styles.metaIcon}><CalendarIcon /></span>
              <span>
                <span className={styles.metaLabel}>Días de Unidad</span>
                Del 8 al 19 de diciembre de 2026
              </span>
            </li>
            <li className={styles.metaItem}>
              <span className={styles.metaIcon}><CalendarIcon /></span>
              <span>
                <span className={styles.metaLabel}>Junta Pública</span>
                Domingo 20 de diciembre · 12:00 hrs
              </span>
            </li>
            <li className={styles.metaItem}>
              <span className={styles.metaIcon}><MapIcon /></span>
              <span>
                <span className={styles.metaLabel}>Sede</span>
                Explanada del grupo
              </span>
            </li>
          </ul>

          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#itinerario">
              Consultar itinerario
            </a>
            <a className={styles.secondaryButton} href="tel:+527774973233">
              Informes: 777 497 32 33
            </a>
          </div>
        </div>

        <figure className={styles.heroMedia}>
          <img
            src={assetUrl('images/aniversarios/grupo_37178/invitacion.jpg')}
            alt="Cartel oficial del 16 Aniversario del Grupo Hoy Volvemos a Empezar"
          />
        </figure>
      </section>

      <blockquote className={styles.quote}>
        «La verdad puede compararse con una piedra preciosa. Si la lanzamos contra el rostro de
        alguien, puede herir; pero si la envolvemos en un delicado papel y la ofrecemos con ternura,
        ciertamente será aceptada con agrado.»
      </blockquote>

      <section className={styles.itinerary} id="itinerario" aria-labelledby="itinerario-title">
        <header className={styles.sectionHead}>
          <p className={styles.sectionScript}>Días de Unidad</p>
          <h2 id="itinerario-title">Itinerario</h2>
          <p>Del 8 al 20 de diciembre de 2026 · Grupos y mesas participantes</p>
        </header>

        {invitationBlocks.map((block) => {
          const days = invitationDays.filter((day) => day.block === block.id)

          return (
            <div className={styles.block} key={block.id}>
              <div className={styles.blockHead}>
                <h3>{block.title}</h3>
                <span>{block.label}</span>
              </div>

              <div className={styles.days}>
                {days.map((day) => (
                  <article
                    className={`${styles.day} ${day.isMeeting ? styles.dayJunta : ''}`}
                    key={day.date}
                  >
                    <time className={styles.dayDate} dateTime={day.date}>
                      <span className={styles.weekday}>{day.weekday}</span>
                      <span className={styles.dayNumber}>{day.day}</span>
                      <span className={styles.month}>Dic</span>
                    </time>

                    <div className={styles.dayBody}>
                      <ul className={styles.groups}>
                        {day.groups.map((group) => (
                          <li key={group}>{group}</li>
                        ))}
                      </ul>
                      <span className={styles.topic}>{day.topic}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      <section className={styles.closing} aria-labelledby="junta-title">
        <div>
          <p className={styles.sectionScript}>Cierre de aniversario</p>
          <h2 id="junta-title">Junta Pública de Información</h2>
          <p className={styles.closingDate}>Domingo 20 de diciembre de 2026 · 12:00 hrs</p>
          <p>Explanada del grupo</p>
          <p>
            La Conciencia del Grupo agradece de corazón a los grupos, mesas, servidores y familias
            que hacen posibles estos días de unidad.
          </p>
        </div>

        <div className={styles.closingContact}>
          <span>Informes</span>
          <strong>Ana Lilia</strong>
          <a href="tel:+527774973233">
            <PhoneIcon /> 777 497 32 33
          </a>
        </div>
      </section>

      <p className={styles.footerNote}>Unidad · Servicio · Recuperación</p>
    </div>
  )
}

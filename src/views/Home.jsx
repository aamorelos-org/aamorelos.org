import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Carousel from '../components/ui/Carousel'
import ReflectionCard from '../components/ui/ReflectionCard'
import CommitteeCard from '../components/ui/CommitteeCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { api } from '../services/api'
import { site } from '../data/site'
import styles from './Home.module.css'

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

const introCards = [
  {
    icon: HeartIcon,
    title: '¿Qué es Alcohólicos Anónimos?',
    text: 'Una comunidad de hombres y mujeres que comparten su experiencia, fortaleza y esperanza para resolver su problema común.',
    to: '/pages/info/info.php',
    cta: 'Conoce la comunidad',
  },
  {
    icon: UsersIcon,
    title: 'Encuentra un grupo',
    text: 'Consulta el directorio de grupos del Área Morelos por municipio, colonia, tipo de reunión y horario.',
    to: '/pages/grupos/grupos.php',
    cta: 'Buscar un grupo',
  },
  {
    icon: MapIcon,
    title: 'Distritos y ubicación',
    text: 'Conoce los distritos que conforman el Área Morelos y ubica el más cercano a tu domicilio.',
    to: '/pages/distritos/distritos.php',
    cta: 'Ver distritos',
  },
]

export default function Home() {
  useDocumentTitle('Inicio')

  const [events, setEvents] = useState([])
  const [reflections, setReflections] = useState([])
  const [committees, setCommittees] = useState([])

  useEffect(() => {
    let active = true

    Promise.all([
      api.getEvents().catch(() => null),
      api.getReflections().catch(() => null),
      api.getCommittees().catch(() => []),
    ]).then(([eventsRes, reflectionsRes, committeesRes]) => {
      if (active) {
        const evList = Array.isArray(eventsRes?.data) ? eventsRes.data : (Array.isArray(eventsRes) ? eventsRes : [])
        const refList = Array.isArray(reflectionsRes?.data) ? reflectionsRes.data : (Array.isArray(reflectionsRes) ? reflectionsRes : [])
        const comList = Array.isArray(committeesRes?.data) ? committeesRes.data : (Array.isArray(committeesRes) ? committeesRes : [])

        setEvents(evList)
        setReflections(refList)
        setCommittees(comList)
      }
    }).catch(() => {})

    return () => {
      active = false
    }
  }, [])

  const reflectionItems = Array.isArray(reflections) ? reflections : []

  return (
    <div className={styles.home}>
      <Carousel items={events} />

      <section className={styles.introGrid} aria-label="Información principal">
        {introCards.map(({ icon: Icon, title, text, to, cta }) => (
          <Link key={title} to={to} className={styles.introCard}>
            <span className={styles.introIcon}>
              <Icon />
            </span>
            <h2>{title}</h2>
            <p>{text}</p>
            <span className={styles.introLink}>
              {cta}
              <Arrow />
            </span>
          </Link>
        ))}
      </section>

      <section className={styles.helpBanner} aria-label="¿Necesitas ayuda?">
        <div>
          <h2>¿Crees que estás bebiendo demasiado y no puedes parar?</h2>
          <p>
            No tienes que enfrentarlo solo. Si deseas información para ti o para un ser querido,
            puedes comunicarte con nosotros. La atención es confidencial y sin costo.
          </p>
        </div>
        <div className={styles.helpActions}>
          <a className={styles.helpPrimary} href={`tel:${site.phoneHref}`}>
            Llamar {site.phone}
          </a>
          <Link className={styles.helpSecondary} to="/pages/reflexiones/bebiendo_demasiado">
            Leer más
          </Link>
        </div>
      </section>

      <section className={styles.reflectionSection} id="reflexiones" aria-labelledby="reflections-title">
        <div className={styles.reflectionHead}>
          <div>
            <h2 id="reflections-title">Reflexiones</h2>
            <p>Mensajes breves para acompañar el camino de la recuperación.</p>
          </div>
          <Link className={styles.reflectionLink} to="/reflexiones">
            Ver todas
            <Arrow />
          </Link>
        </div>

        <div className={styles.reflectionGrid}>
          {reflectionItems.slice(0, 3).map((reflection) => (
            <ReflectionCard key={reflection.id} reflection={reflection} />
          ))}
        </div>
      </section>

      <section className={styles.section} id="comites" aria-labelledby="committees-title">
        <div className={styles.sectionHead}>
          <div>
            <h2 id="committees-title">Comités de servicio</h2>
            <p>Áreas de servicio que apoyan la recuperación y la unidad de la comunidad.</p>
          </div>
        </div>

        <div className={styles.committeeGrid}>
          {committees.map((committee) => (
            <CommitteeCard key={committee.id} committee={committee} />
          ))}
        </div>
      </section>
    </div>
  )
}

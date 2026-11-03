import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
      <path d="M17.5 15h1a5 5 0 0 1 5 5v1" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Z" />
      <path d="M4 5.5v16" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14" />
      <path d="M15 6v14" />
    </svg>
  )
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 4c0 9-5.5 14-12 14H4c0-8 5-14 16-14Z" />
      <path d="M4 20c2.5-5 6-8.5 11-11" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

const links = [
  { to: '/', label: 'Inicio', icon: HomeIcon, end: true },
  {
    label: 'Información',
    icon: InfoIcon,
    children: [
      { to: '/pages/info/info.php', label: '¿Qué es AA?' },
      { to: '/pages/info/eventos.php', label: 'Eventos y noticias' },
    ],
  },
  { to: '/pages/grupos/grupos.php', label: 'Grupos', icon: UsersIcon },
  { to: '/pages/directorio/directorio.php', label: 'Directorio', icon: BookIcon },
  { to: '/pages/ubicacion/ubicacion.php', label: 'Ubicación', icon: PinIcon },
  { to: '/pages/distritos/distritos.php', label: 'Distritos', icon: MapIcon },
  { to: '/reflexiones', label: 'Reflexiones', icon: LeafIcon },
  { to: '/admin', label: 'Admin', icon: ShieldIcon },
]

function isInformationRoute(pathname) {
  return pathname.startsWith('/pages/info') || pathname.startsWith('/pages/eventos')
}

function isReflectionRoute(pathname) {
  return pathname.startsWith('/pages/reflections') || pathname === '/reflexiones'
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
    setInfoOpen(false)
  }, [location.pathname])

  const infoActive = isInformationRoute(location.pathname)

  return (
    <nav className={styles.nav} aria-label="Navegación principal">
      <div className={`container ${styles.inner}`}>
        <div className={styles.bar}>
          <span className={styles.barTitle}>Menú</span>
          <button
            className={styles.toggle}
            type="button"
            aria-label={mobileOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={mobileOpen}
            aria-controls="nav-menu"
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div id="nav-menu" className={`${styles.menu} ${mobileOpen ? styles.menuOpen : ''}`}>
          {links.map((link) => {
            if (link.children) {
              const Icon = link.icon
              return (
                <div key={link.label} className={`${styles.dropdownWrap} ${infoActive ? styles.active : ''}`}>
                  <button
                    type="button"
                    className={`${styles.trigger} ${infoActive ? styles.triggerActive : ''}`}
                    aria-haspopup="true"
                    aria-expanded={infoOpen}
                    onClick={() => setInfoOpen((value) => !value)}
                  >
                    <Icon />
                    <span className={styles.text}>{link.label}</span>
                  </button>
                  <div className={`${styles.dropdown} ${infoOpen ? styles.dropdownOpen : ''}`}>
                    {link.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) => `${styles.dropdownLink} ${isActive ? styles.dropdownLinkActive : ''}`}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )
            }

            const Icon = link.icon
            const isReflection = link.label === 'Reflexiones'

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => {
                  const active = isReflection ? isReflectionRoute(location.pathname) : isActive
                  return `${styles.item} ${active ? styles.active : ''}`
                }}
              >
                <Icon />
                <span className={styles.text}>{link.label}</span>
              </NavLink>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

import { Outlet } from 'react-router-dom'
import Header from './Header'
import Navbar from './Navbar'
import Footer from './Footer'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <div className={styles.app}>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <Header />
      <Navbar />
      <main id="main-content" className={`container ${styles.main}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

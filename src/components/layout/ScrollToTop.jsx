import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Devuelve el scroll al inicio al cambiar de ruta.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const timeout = window.setTimeout(() => {
        const target = document.getElementById(hash.slice(1))
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
        window.scrollTo(0, 0)
      }, 60)

      return () => window.clearTimeout(timeout)
    }

    window.scrollTo(0, 0)
    return undefined
  }, [pathname, hash])

  return null
}

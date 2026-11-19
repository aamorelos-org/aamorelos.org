import { useEffect } from 'react'

const SITE_NAME = 'Área Morelos · Alcohólicos Anónimos'

/**
 * Fija `document.title` con sufijo del sitio; sin [title] usa solo el nombre del sitio.
 * @param title Título de la página.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME
  }, [title])
}

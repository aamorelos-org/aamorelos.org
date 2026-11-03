import { useEffect } from 'react'

const SITE_NAME = 'Área Morelos · Alcohólicos Anónimos'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME
  }, [title])
}

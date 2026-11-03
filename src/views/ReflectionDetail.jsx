import { useParams, useSearchParams } from 'react-router-dom'
import reflections from '../data/reflections.json'
import BebiendoDemasiado from './BebiendoDemasiado'
import StandardReflectionDetail from './StandardReflectionDetail'

export default function ReflectionDetail() {
  const { slug = '' } = useParams()
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') || ''
  const cleanSlug = slug.replace(/\.php$/i, '')

  const reflection = reflections.find((item) => {
    if (cleanSlug && item.slug === cleanSlug) {
      return true
    }
    return id && String(item.id) === id
  })

  const isBebiendo = cleanSlug === 'bebiendo_demasiado' || String(reflection?.id) === '10006'

  if (isBebiendo) {
    return <BebiendoDemasiado />
  }

  return <StandardReflectionDetail />
}

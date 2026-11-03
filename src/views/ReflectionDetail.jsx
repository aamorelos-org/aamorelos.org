import { useParams, useSearchParams } from 'react-router-dom'
import BebiendoDemasiado from './BebiendoDemasiado'
import StandardReflectionDetail from './StandardReflectionDetail'

export default function ReflectionDetail() {
  const { slug = '' } = useParams()
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') || ''
  const cleanSlug = slug.replace(/\.php$/i, '')

  const isBebiendo = cleanSlug === 'bebiendo_demasiado' || id === '10006'

  if (isBebiendo) {
    return <BebiendoDemasiado />
  }

  return <StandardReflectionDetail />
}

import ReflectionsPanel from '../components/admin/ReflectionsPanel'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function AdminReflections() {
  useDocumentTitle('Admin · Reflexiones')

  return <ReflectionsPanel />
}

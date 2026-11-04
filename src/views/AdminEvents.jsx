import EventsPanel from '../components/admin/EventsPanel'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function AdminEvents() {
  useDocumentTitle('Admin · Eventos')

  return <EventsPanel />
}

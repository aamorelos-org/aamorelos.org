import AdminHeader from '../components/admin/AdminHeader'
import EventsPanel from '../components/admin/EventsPanel'
import ReflectionsPanel from '../components/admin/ReflectionsPanel'

export default function Admin() {
  return (
    <div className="min-h-full bg-slate-100 px-4 py-6 text-left sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <AdminHeader />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <EventsPanel />
          <ReflectionsPanel />
        </div>
      </div>
    </div>
  )
}

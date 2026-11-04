import { NavLink, Outlet } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader'

const adminLinks = [
  { to: '/admin/eventos', label: 'Eventos' },
  { to: '/admin/reflexiones', label: 'Reflexiones' },
]

export default function AdminLayout() {
  return (
    <div className="min-h-full bg-slate-100 px-4 py-6 text-left sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <AdminHeader />

        <nav className="mb-6 w-fit rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-label="Secciones de administración">
          <div className="flex gap-1">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isActive
                      ? 'bg-purple-600 text-white dark:bg-purple-500'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <Outlet />
      </div>
    </div>
  )
}

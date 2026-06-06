import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Products', icon: '👗' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/returns', label: 'Returns', icon: '🔄' },
  { to: '/admin/customers', label: 'Customers', icon: '👥' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-gray-200 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-maroon">
            Admin Panel
          </p>
          <h1 className="mt-1 font-display text-lg font-semibold text-brand-charcoal">
            Vineeta & Kanheya
          </h1>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-maroon text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-brand-charcoal'
                }`
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <NavLink
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
          >
            ← Back to Store
          </NavLink>
        </div>
      </aside>
    </>
  )
}

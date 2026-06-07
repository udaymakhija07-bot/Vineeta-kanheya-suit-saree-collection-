import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { isUserAdmin } from '@/services/authService'
import { APP_NAME } from '@/utils/constants'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop All' },
  { to: '/shop?brand=vineeta', label: 'Vineeta Suits' },
  { to: '/shop?brand=kanheya', label: 'Kanheya Sarees' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const { itemCount } = useCart()
  const { user, profile } = useAuth()
  const isAdmin = isUserAdmin(profile, user?.email)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="border-b border-brand-gold/30 bg-brand-maroon text-white">
          <div className="container-app py-2 text-center text-xs sm:text-sm">
            Free delivery on orders above ₹999 · Authentic ethnic wear
          </div>
        </div>

        <div className="container-app flex h-16 items-center justify-between gap-4">
          {/* Mobile Hamburger Menu (visible only on mobile/tablet) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-md p-2 text-brand-charcoal hover:bg-brand-cream lg:hidden"
            aria-label="Open navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <Link to="/" className="min-w-0 flex-1 lg:flex-none">
            <p className="font-display text-lg font-semibold text-brand-maroon sm:text-xl truncate">
              {APP_NAME}
            </p>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition hover:text-brand-maroon ${
                    isActive ? 'text-brand-maroon' : 'text-brand-charcoal'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden text-sm font-medium text-brand-maroon hover:underline sm:inline"
              >
                Admin
            </Link>
            )}
            <Link
              to={user ? '/account' : '/login'}
              className="hidden text-sm font-medium text-brand-charcoal hover:text-brand-maroon sm:inline"
            >
              {user ? 'Account' : 'Login'}
            </Link>
            <Link
              to="/cart"
              className="relative rounded-md p-2 text-brand-charcoal hover:bg-brand-cream"
              aria-label="Shopping cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-maroon text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Slide-out menu, rendered outside the <header> to avoid backdrop-blur clipping context) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 transition-opacity"
            aria-label="Close menu"
          />

          {/* Drawer Content */}
          <aside className="fixed inset-y-0 left-0 flex w-72 max-w-xs flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out z-50">
            <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6 bg-brand-maroon text-white">
              <span className="font-display font-semibold tracking-wide">{APP_NAME}</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-md p-1.5 text-white/80 hover:text-white hover:bg-white/10"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
              <p className="px-3 text-xxs font-bold uppercase tracking-wider text-gray-400">Navigation</p>
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-brand-maroon/10 text-brand-maroon'
                        : 'text-brand-charcoal hover:bg-brand-cream hover:text-brand-maroon'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="my-4 border-t border-gray-100" />

              <p className="px-3 text-xxs font-bold uppercase tracking-wider text-gray-400">Account</p>
              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-brand-maroon/10 text-brand-maroon'
                        : 'text-brand-charcoal hover:bg-brand-cream hover:text-brand-maroon'
                    }`
                  }
                >
                  Admin Panel Dashboard
                </NavLink>
              )}

              <NavLink
                to={user ? '/account' : '/login'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-maroon/10 text-brand-maroon'
                      : 'text-brand-charcoal hover:bg-brand-cream hover:text-brand-maroon'
                  }`
                }
              >
                {user ? 'My Account' : 'Login / Register'}
              </NavLink>
            </nav>

            <div className="border-t border-gray-100 p-4 bg-brand-cream/30 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} {APP_NAME}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

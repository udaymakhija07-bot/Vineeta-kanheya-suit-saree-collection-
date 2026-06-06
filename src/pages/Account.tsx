import { Link } from 'react-router-dom'
import OrderStatusBadge from '@/components/order/OrderStatusBadge'
import PaymentStatusBadge from '@/components/order/PaymentStatusBadge'
import Button from '@/components/ui/Button'
import Loader from '@/components/ui/Loader'
import { useAuth } from '@/hooks/useAuth'
import { useUserOrders } from '@/hooks/useUserOrders'
import { logoutUser, isUserAdmin } from '@/services/authService'
import { formatPrice } from '@/utils/formatPrice'
import { buildCustomerWhatsAppLink, openWhatsApp } from '@/utils/whatsapp'

export default function Account() {
  const { user, profile, loading, initialized } = useAuth()
  const { orders } = useUserOrders(user?.uid, initialized)
  const recentOrders = orders.slice(0, 3)

  if (!initialized || loading) return <Loader />

  if (!user) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="text-2xl font-semibold">Please log in</h1>
        <Link to="/login" className="mt-4 inline-block">
          <Button>Login</Button>
        </Link>
      </div>
    )
  }

  const isAdmin = isUserAdmin(profile, user.email)

  return (
    <div className="container-app py-10">
      <h1 className="font-display text-3xl font-semibold text-brand-maroon">My Account</h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-semibold">Profile</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium">{profile?.displayName || user.displayName || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium">{user.email || '—'}</dd>
            </div>
            {isAdmin && (
              <div>
                <dt className="text-gray-500">Role</dt>
                <dd>
                  <span className="rounded-full bg-brand-gold/30 px-2 py-0.5 text-xs font-semibold uppercase">
                    Admin
                  </span>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold">Quick Links</h2>
          <div className="mt-4 space-y-3">
            <Link to="/orders" className="block text-brand-maroon hover:underline">
              View All Orders →
            </Link>
            <Link to="/cart" className="block text-brand-maroon hover:underline">
              View Cart →
            </Link>
            <button
              type="button"
              onClick={() => openWhatsApp(buildCustomerWhatsAppLink())}
              className="block text-brand-maroon hover:underline"
            >
              Contact Store on WhatsApp →
            </button>
            {isAdmin && (
              <Link to="/admin" className="block text-brand-maroon hover:underline">
                Admin Dashboard →
              </Link>
            )}
            <button
              type="button"
              onClick={() => logoutUser()}
              className="text-red-600 hover:underline"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {recentOrders.length > 0 && (
        <section className="mt-8">
          <h2 className="font-semibold text-brand-charcoal">Recent Orders</h2>
          <div className="mt-4 space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="card flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{formatPrice(order.total)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <PaymentStatusBadge status={order.paymentStatus} />
                  <OrderStatusBadge status={order.status} />
                  <Link
                    to={`/orders/${order.id}/track`}
                    className="text-sm text-brand-maroon hover:underline"
                  >
                    Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

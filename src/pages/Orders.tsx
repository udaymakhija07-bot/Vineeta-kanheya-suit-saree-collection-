import { useState } from 'react'
import { Link } from 'react-router-dom'
import OrderStatusBadge from '@/components/order/OrderStatusBadge'
import PaymentStatusBadge from '@/components/order/PaymentStatusBadge'
import OrderTimeline from '@/components/order/OrderTimeline'
import Loader from '@/components/ui/Loader'
import Button from '@/components/ui/Button'
import ReturnRequestForm from '@/components/order/ReturnRequestForm'
import { useAuth } from '@/hooks/useAuth'
import { useUserOrders } from '@/hooks/useUserOrders'
import { generateInvoicePdf } from '@/services/invoiceService'
import { formatPrice } from '@/utils/formatPrice'
import { buildCustomerWhatsAppLink, openWhatsApp } from '@/utils/whatsapp'

export default function Orders() {
  const { user, loading: authLoading, initialized } = useAuth()
  const { orders, loading, error } = useUserOrders(user?.uid, initialized)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null)

  if (!initialized || authLoading || loading) return <Loader label="Loading orders..." />

  if (!user) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="text-2xl font-semibold">Please log in to view orders</h1>
        <Link to="/login?redirect=/orders" className="mt-4 inline-block">
          <Button>Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-app py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-maroon">My Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            {orders.length} order{orders.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => openWhatsApp(buildCustomerWhatsAppLink())}
        >
          Contact Store on WhatsApp
        </Button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-500">No orders yet.</p>
          <Link to="/shop" className="mt-4 inline-block">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-brand-charcoal">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <PaymentStatusBadge status={order.paymentStatus} />
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between gap-4">
                    <span>
                      {item.name} × {item.quantity}
                      <span className="text-gray-400"> ({item.size}, {item.color})</span>
                    </span>
                    <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 grid gap-1 text-sm text-gray-600 sm:grid-cols-2">
                <p>Subtotal: {formatPrice(order.subtotal)}</p>
                <p>Shipping: {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</p>
              </div>

              <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 font-semibold">
                <span>Total Amount</span>
                <span className="text-brand-maroon">{formatPrice(order.total)}</span>
              </div>

              {order.upiTransactionId && (
                <p className="mt-2 text-xs text-gray-500">
                  UTR: <code className="rounded bg-gray-100 px-1">{order.upiTransactionId}</code>
                </p>
              )}

              {order.paymentStatus === 'verification_pending' && (
                <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  Your payment is pending verification. We will confirm your order soon.
                </p>
              )}

              {order.paymentStatus === 'verified' && (
                <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
                  Payment verified! Your order is {order.status === 'confirmed' ? 'confirmed' : 'being processed'}.
                </p>
              )}

              {order.paymentStatus === 'rejected' && (
                <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
                  Payment was rejected. Please contact the store on WhatsApp for help.
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/orders/${order.id}/track`}>
                  <Button variant="secondary">Track Order</Button>
                </Link>
                <Button variant="secondary" onClick={() => generateInvoicePdf(order)}>
                  Download Invoice
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                >
                  {expandedId === order.id ? 'Hide Timeline' : 'View Progress'}
                </Button>
                {order.status === 'delivered' && (
                  <Button variant="secondary" onClick={() => setReturnOrderId(order.id)}>
                    Return / Exchange
                  </Button>
                )}
              </div>

              {expandedId === order.id && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <OrderTimeline order={order} />
                </div>
              )}

              {returnOrderId === order.id && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <ReturnRequestForm
                    orderId={order.id}
                    onSuccess={() => setReturnOrderId(null)}
                    onCancel={() => setReturnOrderId(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

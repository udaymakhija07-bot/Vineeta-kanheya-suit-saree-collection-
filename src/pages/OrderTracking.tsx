import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import OrderStatusBadge from '@/components/order/OrderStatusBadge'
import PaymentStatusBadge from '@/components/order/PaymentStatusBadge'
import OrderTimeline from '@/components/order/OrderTimeline'
import Loader from '@/components/ui/Loader'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { subscribeToOrder } from '@/services/orderService'
import { generateInvoicePdf } from '@/services/invoiceService'
import type { Order } from '@/types'
import { formatPrice } from '@/utils/formatPrice'
import { getEstimatedDeliveryDate } from '@/utils/orderHelpers'
import { buildCustomerWhatsAppLink, openWhatsApp } from '@/utils/whatsapp'

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>()
  const { user, loading: authLoading, initialized } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId || !initialized) {
      return
    }

    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const unsubscribe = subscribeToOrder(
      orderId,
      (data) => {
        if (!data) {
          setError('Order not found.')
          setOrder(null)
        } else if (data.userId !== user.uid) {
          setError('You do not have access to this order.')
          setOrder(null)
        } else {
          setError('')
          setOrder(data)
        }
        setLoading(false)
      },
      () => {
        setError('Failed to load order.')
        setLoading(false)
      },
    )

    return unsubscribe
  }, [orderId, user, initialized])

  if (!initialized || authLoading || loading) return <Loader label="Loading order..." />

  if (!user) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="text-2xl font-semibold">Please log in to track your order</h1>
        <Link to={`/login?redirect=/orders/${orderId}/track`} className="mt-4 inline-block">
          <Button>Login</Button>
        </Link>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="text-2xl font-semibold">{error || 'Order not found'}</h1>
        <Link to="/orders" className="mt-4 inline-block text-brand-maroon hover:underline">
          Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div className="container-app py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-maroon">Track Order</h1>
          <p className="mt-1 text-sm text-gray-500">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PaymentStatusBadge status={order.paymentStatus} />
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card p-6">
          <h2 className="font-semibold">Order Progress</h2>
          <div className="mt-6">
            <OrderTimeline order={order} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-semibold">Delivery Info</h2>
            <p className="mt-3 text-sm text-gray-600">
              <span className="font-medium text-brand-charcoal">Expected Delivery:</span>
              <br />
              Within 5 Working Days
              <br />
              <span className="text-brand-maroon">{getEstimatedDeliveryDate(order.createdAt)}</span>
            </p>
            <p className="mt-4 text-sm text-gray-600">
              {order.shippingAddress.line1}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.pincode}
            </p>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold">Order Summary</h2>
            <ul className="mt-3 space-y-1 text-sm text-gray-600">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-2xl font-semibold text-brand-maroon">
              {formatPrice(order.total)}
            </p>
            {order.upiTransactionId && (
              <p className="mt-2 text-xs text-gray-500">UTR: {order.upiTransactionId}</p>
            )}
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="secondary" onClick={() => generateInvoicePdf(order)}>
                Download Invoice
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  openWhatsApp(
                    buildCustomerWhatsAppLink(
                      `Hi, I need help with order ${order.id.slice(0, 8).toUpperCase()}`,
                    ),
                  )
                }
              >
                Contact Store on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

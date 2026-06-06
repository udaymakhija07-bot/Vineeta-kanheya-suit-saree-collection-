import { useState } from 'react'
import OrderStatusBadge from '@/components/order/OrderStatusBadge'
import PaymentStatusBadge from '@/components/order/PaymentStatusBadge'
import Loader from '@/components/ui/Loader'
import Select from '@/components/ui/Select'
import { useAdminOrders } from '@/hooks/useAdminOrders'
import {
  rejectOrderPayment,
  updateOrderStatus,
  verifyOrderPayment,
} from '@/services/orderService'
import type { OrderStatus } from '@/types'
import { formatPrice } from '@/utils/formatPrice'
import { buildAdminOrderWhatsAppLink, openWhatsApp } from '@/utils/whatsapp'

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'out_for_delivery', label: 'Out For Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AdminOrders() {
  const { orders, loading, error } = useAdminOrders()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleVerify = async (orderId: string) => {
    setUpdatingId(orderId)
    try {
      await verifyOrderPayment(orderId)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleReject = async (orderId: string) => {
    if (!window.confirm('Reject this payment? The order will be cancelled.')) return
    setUpdatingId(orderId)
    try {
      await rejectOrderPayment(orderId)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId)
    try {
      await updateOrderStatus(orderId, status)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <Loader label="Loading orders..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-charcoal">Orders</h1>
        <p className="mt-1 text-gray-600">Verify payments and manage fulfillment</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Order</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">UTR</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Payment</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const needsVerification =
                    order.paymentStatus === 'verification_pending' && order.upiTransactionId

                  return (
                    <tr key={order.id} className="align-top hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString('en-IN')}
                        </p>
                        <ul className="mt-2 space-y-0.5 text-xs text-gray-500">
                          {order.items.map((item, i) => (
                            <li key={i}>
                              {item.name} × {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerPhone}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {order.shippingAddress.city}, {order.shippingAddress.pincode}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold">{formatPrice(order.total)}</p>
                        <p className="text-xs text-gray-500">
                          Ship: {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        {order.upiTransactionId ? (
                          <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                            {order.upiTransactionId}
                          </code>
                        ) : (
                          <span className="text-gray-400">Awaiting payment</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="px-4 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-4 space-y-2">
                        {needsVerification && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={updatingId === order.id}
                              onClick={() => handleVerify(order.id)}
                              className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              Verify Payment
                            </button>
                            <button
                              type="button"
                              disabled={updatingId === order.id}
                              onClick={() => handleReject(order.id)}
                              className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              Reject Payment
                            </button>
                          </div>
                        )}
                        {order.paymentStatus === 'verified' && (
                          <Select
                            name={`status-${order.id}`}
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            options={ORDER_STATUS_OPTIONS}
                            className="min-w-[160px]"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => openWhatsApp(buildAdminOrderWhatsAppLink(order))}
                          className="block w-full rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                        >
                          Notify Admin on WhatsApp
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

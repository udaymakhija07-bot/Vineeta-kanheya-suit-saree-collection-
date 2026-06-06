import { useEffect, useMemo, useState } from 'react'
import { subscribeToAllOrders } from '@/services/orderService'
import type { Order, OrderStatus } from '@/types'

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToAllOrders(
      (data) => {
        setOrders((prev) => {
          if (prev.length === data.length && prev.every((o, i) => o.id === data[i]?.id && o.status === data[i]?.status)) {
            return prev
          }
          return data
        })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const stats = useMemo(() => {
    const countByStatus = (status: OrderStatus) =>
      orders.filter((order) => order.status === status).length

    const revenue = orders
      .filter((order) => order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0)

    return {
      total: orders.length,
      pending: countByStatus('pending'),
      confirmed: countByStatus('confirmed'),
      processing: countByStatus('processing'),
      shipped: countByStatus('shipped'),
      outForDelivery: countByStatus('out_for_delivery'),
      delivered: countByStatus('delivered'),
      cancelled: countByStatus('cancelled'),
      revenue,
    }
  }, [orders])

  return { orders, loading, error, stats }
}

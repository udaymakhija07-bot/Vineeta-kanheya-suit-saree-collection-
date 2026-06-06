import { useEffect, useMemo, useState } from 'react'
import { getAllCustomers } from '@/services/customerService'
import { useAdminOrders } from '@/hooks/useAdminOrders'
import { useAdminProducts } from '@/hooks/useProducts'

export function useAdminAnalytics() {
  const { orders, loading: ordersLoading, stats: orderStats } = useAdminOrders()
  const { products, loading: productsLoading, stats: productStats } = useAdminProducts()
  const [customerCount, setCustomerCount] = useState(0)
  const [customersLoading, setCustomersLoading] = useState(true)

  useEffect(() => {
    getAllCustomers()
      .then((customers) => setCustomerCount(customers.length))
      .finally(() => setCustomersLoading(false))
  }, [])

  const analytics = useMemo(
    () => ({
      totalOrders: orderStats.total,
      totalRevenue: orderStats.revenue,
      totalCustomers: customerCount,
      totalProducts: productStats.total,
      pendingOrders: orderStats.pending,
      deliveredOrders: orderStats.delivered,
      confirmedOrders: orderStats.confirmed,
      processingOrders: orderStats.processing,
    }),
    [orderStats, customerCount, productStats.total],
  )

  return {
    orders,
    products,
    analytics,
    loading: ordersLoading || productsLoading || customersLoading,
  }
}

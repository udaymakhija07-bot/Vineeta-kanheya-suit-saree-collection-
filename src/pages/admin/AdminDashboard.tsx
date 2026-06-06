import { Link } from 'react-router-dom'
import OrderStatusBadge from '@/components/order/OrderStatusBadge'
import StatCard from '@/components/admin/StatCard'
import Button from '@/components/ui/Button'
import Loader from '@/components/ui/Loader'
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics'
import { formatPrice } from '@/utils/formatPrice'

export default function AdminDashboard() {
  const { orders, products, analytics, loading } = useAdminAnalytics()

  if (loading) return <Loader label="Loading dashboard..." />

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-charcoal">Dashboard</h1>
          <p className="mt-1 text-gray-600">Store analytics and overview</p>
        </div>
        <Link to="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Orders" value={analytics.totalOrders} accent="maroon" />
        <StatCard label="Total Revenue" value={formatPrice(analytics.totalRevenue)} accent="green" />
        <StatCard label="Total Customers" value={analytics.totalCustomers} accent="gold" />
        <StatCard label="Total Products" value={analytics.totalProducts} accent="gray" />
        <StatCard label="Pending Orders" value={analytics.pendingOrders} accent="gold" />
        <StatCard label="Delivered Orders" value={analytics.deliveredOrders} accent="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-brand-charcoal">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-brand-maroon hover:underline">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <OrderStatusBadge status={order.status} />
                    <p className="mt-1 text-sm font-semibold">{formatPrice(order.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-brand-charcoal">Inventory Alerts</h2>
            <Link to="/admin/products" className="text-sm text-brand-maroon hover:underline">
              Manage products
            </Link>
          </div>
          {products.filter((p) => !p.inStock || p.stockQuantity <= 5).length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-500">All products are well stocked.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {products
                .filter((p) => !p.inStock || p.stockQuantity <= 5)
                .slice(0, 5)
                .map((product) => (
                  <div key={product.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${product.inStock ? 'text-yellow-700' : 'text-red-600'}`}
                    >
                      {product.inStock ? `${product.stockQuantity} left` : 'Out of stock'}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

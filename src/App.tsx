import { Routes, Route } from 'react-router-dom'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminRoute from '@/components/admin/AdminRoute'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import Login from '@/pages/Login'
import Account from '@/pages/Account'
import Orders from '@/pages/Orders'
import OrderTracking from '@/pages/OrderTracking'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import NotFound from '@/pages/NotFound'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProducts from '@/pages/admin/AdminProducts'
import AdminProductForm from '@/pages/admin/AdminProductForm'
import AdminOrders from '@/pages/admin/AdminOrders'
import AdminReturnRequests from '@/pages/admin/AdminReturnRequests'
import AdminCustomers from '@/pages/admin/AdminCustomers'
import AdminSettings from '@/pages/admin/AdminSettings'

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="returns" element={<AdminReturnRequests />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="login" element={<Login />} />
        <Route path="account" element={<Account />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:orderId/track" element={<OrderTracking />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

import { FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import QrPaymentSection from '@/components/checkout/QrPaymentSection'
import CartSummary from '@/components/cart/CartSummary'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import {
  calculateOrderTotals,
  createOrder,
  getOrderById,
  submitOrderUtr,
} from '@/services/orderService'
import { buildAdminOrderWhatsAppLink, openWhatsApp } from '@/utils/whatsapp'

type CheckoutStep = 'shipping' | 'payment' | 'complete'

export default function Checkout() {
  const { user } = useAuth()
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    pincode: '',
  })

  const { total } = useMemo(() => calculateOrderTotals(items), [items])

  if (items.length === 0 && step !== 'complete') {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="text-2xl font-semibold">Nothing to checkout</h1>
        <Link to="/shop" className="mt-4 inline-block text-brand-maroon hover:underline">
          Continue shopping
        </Link>
      </div>
    )
  }

  const handleShippingSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!user) {
        navigate('/login?redirect=/checkout')
        return
      }

      const newOrderId = await createOrder(
        user.uid,
        items,
        {
          id: crypto.randomUUID(),
          label: form.name,
          line1: form.line1,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          isDefault: true,
        },
        form.name,
        form.phone,
      )

      setOrderId(newOrderId)
      setStep('payment')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  const handleUtrSubmit = async (utr: string) => {
    if (!orderId) return

    setError('')
    setLoading(true)

    try {
      await submitOrderUtr(orderId, utr)
      clearCart()
      setStep('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit payment details')
    } finally {
      setLoading(false)
    }
  }

  const handleNotifyAdmin = async () => {
    if (!orderId) return
    const order = await getOrderById(orderId)
    if (order) {
      openWhatsApp(buildAdminOrderWhatsAppLink(order))
    }
  }

  if (step === 'complete' && orderId) {
    return (
      <div className="container-app py-16 text-center">
        <div className="mx-auto max-w-md card p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
            ✓
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-brand-maroon">
            Payment Submitted!
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Order ID: <strong>{orderId.slice(0, 8).toUpperCase()}</strong>
          </p>
          <p className="mt-2 text-sm text-amber-700">
            Payment Status: Pending Verification. We will confirm your order shortly.
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Estimated delivery within 5 working days after confirmation.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={handleNotifyAdmin} variant="secondary" className="w-full">
              Notify Admin on WhatsApp
            </Button>
            <Link to={`/orders/${orderId}/track`}>
              <Button className="w-full">Track Order</Button>
            </Link>
            <Link to="/orders">
              <Button variant="secondary" className="w-full">
                View My Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-app py-10">
      <h1 className="font-display text-3xl font-semibold text-brand-maroon">Checkout</h1>

      {!user && (
        <p className="mt-4 rounded-md bg-brand-gold/20 px-4 py-3 text-sm">
          Please{' '}
          <Link to="/login?redirect=/checkout" className="font-semibold text-brand-maroon underline">
            log in
          </Link>{' '}
          to complete your order.
        </p>
      )}

      <div className="mt-4 flex gap-2 text-sm">
        <span className={step === 'shipping' ? 'font-semibold text-brand-maroon' : 'text-gray-500'}>
          1. Shipping
        </span>
        <span className="text-gray-400">→</span>
        <span className={step === 'payment' ? 'font-semibold text-brand-maroon' : 'text-gray-500'}>
          2. QR Payment
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card p-6">
          {step === 'shipping' ? (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <h2 className="font-semibold">Shipping Details</h2>

              <Input
                label="Full Name"
                name="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                label="Address"
                name="line1"
                required
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="City"
                  name="city"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
                <Input
                  label="State"
                  name="state"
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>
              <Input
                label="Pincode"
                name="pincode"
                required
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" disabled={loading || !user} className="w-full">
                {loading ? 'Creating Order...' : 'Continue to Payment'}
              </Button>
            </form>
          ) : (
            orderId && (
              <QrPaymentSection
                amount={total}
                orderId={orderId}
                loading={loading}
                error={error}
                onSubmitUtr={handleUtrSubmit}
              />
            )
          )}
        </div>

        <CartSummary subtotal={subtotal} showCheckoutButton={false} />
      </div>
    </div>
  )
}

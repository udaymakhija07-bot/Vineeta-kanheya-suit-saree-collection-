import { Link } from 'react-router-dom'
import CartItemRow from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import Button from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'

export default function Cart() {
  const { items, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-brand-maroon">Your Cart</h1>
        <p className="mt-4 text-gray-600">Your cart is empty.</p>
        <Link to="/shop" className="mt-6 inline-block">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-app py-10">
      <h1 className="font-display text-3xl font-semibold text-brand-maroon">Your Cart</h1>
      <p className="mt-2 text-gray-600">{items.length} item(s) in your cart</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card p-6">
          {items.map((item) => (
            <CartItemRow
              key={`${item.productId}-${item.size}-${item.color}`}
              item={item}
            />
          ))}
        </div>
        <CartSummary subtotal={subtotal} />
      </div>
    </div>
  )
}

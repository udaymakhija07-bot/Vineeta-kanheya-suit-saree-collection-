import { Link } from 'react-router-dom'
import { formatPrice } from '@/utils/formatPrice'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/utils/constants'
import Button from '@/components/ui/Button'

interface CartSummaryProps {
  subtotal: number
  showCheckoutButton?: boolean
}

export default function CartSummary({
  subtotal,
  showCheckoutButton = true,
}: CartSummaryProps) {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shipping

  return (
    <div className="card p-6">
      <h2 className="font-display text-lg font-semibold">Order Summary</h2>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-600">Subtotal</dt>
          <dd className="font-medium">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Shipping</dt>
          <dd className="font-medium">
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </dd>
        </div>
        {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
          <p className="text-xs text-brand-maroon">
            Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
          </p>
        )}
        <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-semibold text-brand-maroon">{formatPrice(total)}</dd>
        </div>
      </dl>

      {showCheckoutButton && (
        <Link to="/checkout" className="mt-6 block">
          <Button className="w-full" disabled={subtotal === 0}>
            Proceed to Checkout
          </Button>
        </Link>
      )}
    </div>
  )
}

import { useCart } from '@/hooks/useCart'
import type { CartItem } from '@/types'
import { formatPrice } from '@/utils/formatPrice'

interface CartItemRowProps {
  item: CartItem
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-4 border-b border-gray-100 py-4 last:border-0">
      <img
        src={item.image}
        alt={item.name}
        className="h-24 w-20 rounded-md object-cover"
      />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-medium text-brand-charcoal">{item.name}</h3>
          <p className="text-sm text-gray-500">
            Size: {item.size} · Color: {item.color}
          </p>
          <p className="mt-1 font-semibold">{formatPrice(item.price)}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
              }
              className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 hover:bg-gray-50"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() =>
                updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
              }
              className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 hover:bg-gray-50"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeItem(item.productId, item.size, item.color)}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

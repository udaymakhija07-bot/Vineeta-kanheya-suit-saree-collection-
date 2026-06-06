import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getCartItemCount,
  getCartSubtotal,
  loadCartFromStorage,
  saveCartToStorage,
} from '@/services/cartService'
import type { CartItem } from '@/types'

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function itemKey(productId: string, size: string, color: string) {
  return `${productId}-${size}-${color}`
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage())

  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => itemKey(i.productId, i.size, i.color) === itemKey(item.productId, item.size, item.color),
      )

      if (existing) {
        return prev.map((i) =>
          itemKey(i.productId, i.size, i.color) === itemKey(item.productId, item.size, item.color)
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        )
      }

      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => itemKey(i.productId, i.size, i.color) !== itemKey(productId, size, color),
      ),
    )
  }, [])

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter(
            (i) => itemKey(i.productId, i.size, i.color) !== itemKey(productId, size, color),
          ),
        )
        return
      }

      setItems((prev) =>
        prev.map((i) =>
          itemKey(i.productId, i.size, i.color) === itemKey(productId, size, color)
            ? { ...i, quantity }
            : i,
        ),
      )
    },
    [],
  )

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = useMemo(() => getCartItemCount(items), [items])
  const subtotal = useMemo(() => getCartSubtotal(items), [items])

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider')
  }
  return context
}

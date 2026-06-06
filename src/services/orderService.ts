import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Address, CartItem, Order, OrderStatus, PaymentStatus } from '@/types'
import { normalizeOrder } from '@/utils/orderHelpers'
import { normalizePhoneDigits } from '@/utils/phone'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/utils/constants'

const ORDERS_COLLECTION = 'orders'

function sortOrdersByDate(orders: Order[]): Order[] {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function calculateOrderTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shipping
  return { subtotal, shipping, total }
}

export async function createOrder(
  userId: string,
  items: CartItem[],
  shippingAddress: Address,
  customerName: string,
  customerPhone: string,
): Promise<string> {
  const { subtotal, shipping, total } = calculateOrderTotals(items)
  const customerPhoneDigits = normalizePhoneDigits(customerPhone)

  const order: Omit<Order, 'id'> = {
    userId,
    items: items.map(({ productId, name, price, image, size, color, quantity }) => ({
      productId,
      name,
      price,
      image,
      size,
      color,
      quantity,
    })),
    subtotal,
    shipping,
    total,
    status: 'pending',
    paymentStatus: 'verification_pending',
    shippingAddress,
    customerName,
    customerPhone,
    customerPhoneDigits,
    paymentMethod: 'qr_upi',
    createdAt: new Date().toISOString(),
  }

  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), order)
  return docRef.id
}

export async function submitOrderUtr(orderId: string, utr: string): Promise<void> {
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    upiTransactionId: utr.trim(),
    paymentStatus: 'verification_pending' satisfies PaymentStatus,
  })
}

export async function verifyOrderPayment(orderId: string): Promise<void> {
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    paymentStatus: 'verified' satisfies PaymentStatus,
    status: 'confirmed' satisfies OrderStatus,
  })
}

export async function rejectOrderPayment(orderId: string): Promise<void> {
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    paymentStatus: 'rejected' satisfies PaymentStatus,
    status: 'cancelled' satisfies OrderStatus,
  })
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const snapshot = await getDoc(doc(db, ORDERS_COLLECTION, orderId))
  if (!snapshot.exists()) return null
  return normalizeOrder(snapshot.id, snapshot.data())
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const q = query(collection(db, ORDERS_COLLECTION), where('userId', '==', userId))
  const snapshot = await getDocs(q)
  return sortOrdersByDate(
    snapshot.docs.map((docSnap) => normalizeOrder(docSnap.id, docSnap.data())),
  )
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), { status })
}

export function subscribeToUserOrders(
  userId: string,
  callback: (orders: Order[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const userQuery = query(collection(db, ORDERS_COLLECTION), where('userId', '==', userId))

  return onSnapshot(
    userQuery,
    (snapshot) => {
      const orders = sortOrdersByDate(
        snapshot.docs.map((docSnap) => normalizeOrder(docSnap.id, docSnap.data())),
      )
      callback(orders)
    },
    (err) => onError?.(err),
  )
}

export function subscribeToOrder(
  orderId: string,
  callback: (order: Order | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, ORDERS_COLLECTION, orderId),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }
      callback(normalizeOrder(snapshot.id, snapshot.data()))
    },
    (err) => onError?.(err),
  )
}

export function subscribeToAllOrders(
  callback: (orders: Order[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(collection(db, ORDERS_COLLECTION))

  return onSnapshot(
    q,
    (snapshot) => {
      const orders = sortOrdersByDate(
        snapshot.docs.map((docSnap) => normalizeOrder(docSnap.id, docSnap.data())),
      )
      callback(orders)
    },
    (err) => onError?.(err),
  )
}

import type { Order, OrderStatus, PaymentStatus } from '@/types'
import { ESTIMATED_DELIVERY_DAYS, ORDER_STATUS_STEPS } from '@/utils/constants'
import { normalizePhoneDigits } from '@/utils/phone'

export function getStatusIndex(status: OrderStatus): number {
  if (status === 'cancelled') return -1
  return ORDER_STATUS_STEPS.findIndex((step) => step.key === status)
}

export function getTrackingStepIndex(order: Order): number {
  if (order.status === 'cancelled' || order.paymentStatus === 'rejected') return -1

  if (order.paymentStatus !== 'verified') {
    return order.upiTransactionId ? 1 : 0
  }

  const statusMap: Record<OrderStatus, number> = {
    pending: 2,
    confirmed: 2,
    processing: 3,
    shipped: 4,
    out_for_delivery: 5,
    delivered: 6,
    cancelled: -1,
  }

  return statusMap[order.status] ?? 2
}

export function getEstimatedDeliveryDate(orderDate: string): string {
  const date = new Date(orderDate)
  let added = 0
  while (added < ESTIMATED_DELIVERY_DAYS) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatOrderStatus(status: OrderStatus | string): string {
  const step = ORDER_STATUS_STEPS.find((s) => s.key === status)
  if (step) return step.label
  if (status === 'cancelled') return 'Cancelled'
  return String(status).replace(/_/g, ' ')
}

export function formatPaymentStatus(status: PaymentStatus | string): string {
  const labels: Record<string, string> = {
    verification_pending: 'Pending Verification',
    verified: 'Verified',
    rejected: 'Rejected',
  }
  return labels[status] ?? String(status).replace(/_/g, ' ')
}

export function normalizeOrder(id: string, data: Record<string, unknown>): Order {
  const paymentMethod = (data.paymentMethod as string) ?? 'qr_upi'
  let paymentStatus = data.paymentStatus as PaymentStatus | undefined

  if (!paymentStatus) {
    paymentStatus = paymentMethod === 'cod' ? 'verified' : 'verification_pending'
  }

  return {
    id,
    userId: data.userId as string,
    items: (data.items as Order['items']) ?? [],
    subtotal: (data.subtotal as number) ?? 0,
    shipping: (data.shipping as number) ?? 0,
    total: (data.total as number) ?? 0,
    status: (data.status as OrderStatus) ?? 'pending',
    paymentStatus,
    shippingAddress: data.shippingAddress as Order['shippingAddress'],
    customerName: (data.customerName as string) ?? '',
    customerPhone: (data.customerPhone as string) ?? '',
    customerPhoneDigits:
      (data.customerPhoneDigits as string | undefined) ??
      normalizePhoneDigits((data.customerPhone as string) ?? ''),
    paymentMethod,
    upiTransactionId: data.upiTransactionId as string | undefined,
    createdAt: (data.createdAt as string) ?? new Date().toISOString(),
  }
}

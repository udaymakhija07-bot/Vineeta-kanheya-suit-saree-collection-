import type { Order } from '@/types'
import { ADMIN_WHATSAPP } from '@/utils/constants'

function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = phone.replace(/\D/g, '')
  const withCountry = normalized.startsWith('91') ? normalized : `91${normalized}`
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`
}

export function buildAdminOrderWhatsAppLink(order: Order): string {
  const productLines = order.items
    .map((item) => `• ${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`)
    .join('\n')

  const message = `🛍️ *New Order Received*

*Order ID:* ${order.id.toUpperCase()}
*Customer Name:* ${order.customerName}
*Phone Number:* ${order.customerPhone}
*Order Amount:* ₹${order.total}

*Products:*
${productLines}

*Address:* ${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.pincode}
*Payment Status:* ${order.paymentStatus}
${order.upiTransactionId ? `*UTR:* ${order.upiTransactionId}` : ''}`

  return buildWhatsAppUrl(ADMIN_WHATSAPP, message)
}

export function buildCustomerWhatsAppLink(message?: string): string {
  const defaultMessage =
    message ??
    'Hello Vineeta Suit Collection & Kanheya Saree Centre, I have a question about my order.'
  return buildWhatsAppUrl(ADMIN_WHATSAPP, defaultMessage)
}

export function openWhatsApp(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer')
}

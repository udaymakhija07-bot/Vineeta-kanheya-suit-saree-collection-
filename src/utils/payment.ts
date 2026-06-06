import { APP_NAME, STORE_UPI_ID } from '@/utils/constants'

export function buildUpiPaymentLink(amount: number, orderId?: string): string {
  const params = new URLSearchParams({
    pa: STORE_UPI_ID,
    pn: APP_NAME,
    am: amount.toFixed(2),
    cu: 'INR',
  })

  if (orderId) {
    params.set('tn', `Order ${orderId.slice(0, 8).toUpperCase()}`)
  }

  return `upi://pay?${params.toString()}`
}

export function buildPaymentQrCodeUrl(amount: number, orderId?: string, size = 240): string {
  const upiLink = buildUpiPaymentLink(amount, orderId)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(upiLink)}`
}

import { jsPDF } from 'jspdf'
import type { Order } from '@/types'
import { APP_NAME, CONTACT } from '@/utils/constants'
import { formatPaymentStatus, formatOrderStatus } from '@/utils/orderHelpers'
import { formatPrice } from '@/utils/formatPrice'

export function generateInvoicePdf(order: Order): void {
  const doc = new jsPDF()
  const margin = 20
  let y = margin

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(APP_NAME, margin, y)

  y += 7
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const addressLines = doc.splitTextToSize(CONTACT.address, 170)
  doc.text(addressLines, margin, y)
  y += addressLines.length * 4 + 2

  doc.text(`Phone: ${CONTACT.phone}`, margin, y)
  y += 4
  doc.text(`Email: ${CONTACT.emails.join(' | ')}`, margin, y)
  y += 4
  doc.text(`Hours: ${CONTACT.hours}`, margin, y)

  y += 10
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('TAX INVOICE', margin, y)

  y += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Order ID: ${order.id.toUpperCase()}`, margin, y)
  y += 5
  doc.text(
    `Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}`,
    margin,
    y,
  )
  y += 5
  doc.text(`Payment Status: ${formatPaymentStatus(order.paymentStatus)}`, margin, y)
  y += 5
  doc.text(`Order Status: ${formatOrderStatus(order.status)}`, margin, y)
  if (order.upiTransactionId) {
    y += 5
    doc.text(`UTR: ${order.upiTransactionId}`, margin, y)
  }

  y += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Bill To:', margin, y)
  y += 5
  doc.setFont('helvetica', 'normal')
  doc.text(order.customerName, margin, y)
  y += 5
  doc.text(order.customerPhone, margin, y)
  y += 5
  const shipAddress = `${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
  const shipLines = doc.splitTextToSize(shipAddress, 170)
  doc.text(shipLines, margin, y)
  y += shipLines.length * 5 + 6

  doc.setFont('helvetica', 'bold')
  doc.text('Product', margin, y)
  doc.text('Qty', margin + 95, y)
  doc.text('Price', margin + 115, y)
  doc.text('Total', margin + 150, y)
  y += 5
  doc.line(margin, y, 190, y)
  y += 5

  doc.setFont('helvetica', 'normal')
  for (const item of order.items) {
    if (y > 260) {
      doc.addPage()
      y = margin
    }
    const nameLines = doc.splitTextToSize(item.name, 85)
    doc.text(nameLines, margin, y)
    doc.text(String(item.quantity), margin + 95, y)
    doc.text(formatPrice(item.price), margin + 115, y)
    doc.text(formatPrice(item.price * item.quantity), margin + 150, y)
    y += Math.max(nameLines.length * 5, 6) + 2
  }

  y += 4
  doc.line(margin, y, 190, y)
  y += 7
  doc.text(`Subtotal: ${formatPrice(order.subtotal)}`, margin + 100, y)
  y += 5
  doc.text(
    `Shipping: ${order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}`,
    margin + 100,
    y,
  )
  y += 7
  doc.setFont('helvetica', 'bold')
  doc.text(`Grand Total: ${formatPrice(order.total)}`, margin + 100, y)

  y += 15
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9)
  doc.text('Thank you for shopping with us!', margin, y)

  doc.save(`invoice-${order.id.slice(0, 8).toUpperCase()}.pdf`)
}

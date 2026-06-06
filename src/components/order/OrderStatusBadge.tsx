import type { OrderStatus } from '@/types'
import { formatOrderStatus } from '@/utils/orderHelpers'

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

interface OrderStatusBadgeProps {
  status: OrderStatus | string
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${statusStyles[status] ?? statusStyles.pending}`}
    >
      {formatOrderStatus(status)}
    </span>
  )
}

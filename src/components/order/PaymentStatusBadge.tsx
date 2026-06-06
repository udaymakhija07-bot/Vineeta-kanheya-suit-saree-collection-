import type { PaymentStatus } from '@/types'
import { formatPaymentStatus } from '@/utils/orderHelpers'

const styles: Record<PaymentStatus, string> = {
  verification_pending: 'bg-amber-100 text-amber-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus | string
}

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const key = status as PaymentStatus
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[key] ?? styles.verification_pending}`}
    >
      {formatPaymentStatus(status)}
    </span>
  )
}

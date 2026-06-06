import type { Order } from '@/types'
import { ORDER_TRACKING_STEPS } from '@/utils/constants'
import { getEstimatedDeliveryDate, getTrackingStepIndex } from '@/utils/orderHelpers'

interface OrderTimelineProps {
  order: Order
  compact?: boolean
}

export default function OrderTimeline({ order, compact = false }: OrderTimelineProps) {
  const currentIndex = getTrackingStepIndex(order)
  const isCancelled = order.status === 'cancelled' || order.paymentStatus === 'rejected'

  if (isCancelled) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {order.paymentStatus === 'rejected'
          ? 'Payment was rejected. This order has been cancelled.'
          : 'This order has been cancelled.'}
      </div>
    )
  }

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {!compact && (
        <p className="text-sm text-gray-600">
          <span className="font-medium text-brand-charcoal">Estimated Delivery:</span>{' '}
          Within 5 Working Days ({getEstimatedDeliveryDate(order.createdAt)})
        </p>
      )}

      <div className="relative space-y-0">
        {ORDER_TRACKING_STEPS.map((step, index) => {
          const isComplete = index < currentIndex
          const isCurrent = index === currentIndex

          return (
            <div key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    isComplete
                      ? 'bg-brand-maroon text-white'
                      : isCurrent
                        ? 'border-2 border-brand-maroon bg-brand-maroon/10 text-brand-maroon'
                        : 'border-2 border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {isComplete ? '✓' : index + 1}
                </div>
                {index < ORDER_TRACKING_STEPS.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 min-h-[24px] ${isComplete ? 'bg-brand-maroon' : 'bg-gray-200'}`}
                  />
                )}
              </div>
              <div
                className={`pb-6 ${
                  isCurrent
                    ? 'font-semibold text-brand-maroon'
                    : isComplete
                      ? 'text-brand-charcoal'
                      : 'text-gray-400'
                }`}
              >
                <p className="text-sm">{step.label}</p>
                {isCurrent && (
                  <p className="text-xs font-normal text-gray-500">
                    {step.key === 'payment_verified' &&
                    order.paymentStatus === 'verification_pending'
                      ? 'Awaiting admin verification'
                      : 'Current step'}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

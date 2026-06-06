import { FormEvent, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { buildPaymentQrCodeUrl } from '@/utils/payment'
import { formatPrice } from '@/utils/formatPrice'

interface QrPaymentSectionProps {
  amount: number
  orderId: string
  loading: boolean
  error: string
  onSubmitUtr: (utr: string) => Promise<void>
}

export default function QrPaymentSection({
  amount,
  orderId,
  loading,
  error,
  onSubmitUtr,
}: QrPaymentSectionProps) {
  const [showUtrForm, setShowUtrForm] = useState(false)
  const [utr, setUtr] = useState('')
  const [localError, setLocalError] = useState('')

  const qrUrl = buildPaymentQrCodeUrl(amount, orderId)

  const handleUtrSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLocalError('')

    const trimmed = utr.trim()
    if (trimmed.length < 6) {
      setLocalError('Please enter a valid UTR / transaction reference number.')
      return
    }

    await onSubmitUtr(trimmed)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-brand-maroon/20 bg-brand-rose/10 p-4">
        <h2 className="font-semibold text-brand-maroon">Scan & Pay via UPI</h2>
        <p className="mt-1 text-sm text-gray-600">
          Scan the QR code below using Paytm, PhonePe, Google Pay, or BHIM. Amount{' '}
          <strong>{formatPrice(amount)}</strong> will be pre-filled.
        </p>
      </div>

      <div className="flex flex-col items-center rounded-xl border bg-white p-6">
        <img
          src={qrUrl}
          alt={`Payment QR for ${formatPrice(amount)}`}
          className="h-56 w-56 rounded-lg border"
        />
        <p className="mt-4 text-center text-sm font-semibold text-brand-maroon">
          Pay {formatPrice(amount)}
        </p>
        <p className="mt-1 text-center text-xs text-gray-500">
          Open any UPI app → Scan QR → Complete payment
        </p>
      </div>

      {!showUtrForm ? (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => setShowUtrForm(true)}
        >
          I Have Completed Payment
        </Button>
      ) : (
        <form onSubmit={handleUtrSubmit} className="space-y-4 rounded-lg border bg-gray-50 p-4">
          <h3 className="font-semibold text-brand-charcoal">Submit Payment Details</h3>
          <p className="text-sm text-gray-600">
            Enter the UTR / Transaction ID from your UPI app after successful payment.
          </p>

          <Input
            label="UTR / Transaction ID"
            name="utr"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            placeholder="e.g. 123456789012"
            required
            minLength={6}
          />

          {(error || localError) && (
            <p className="text-sm text-red-600">{error || localError}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        </form>
      )}
    </div>
  )
}

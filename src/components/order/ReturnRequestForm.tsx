import { FormEvent, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { useAuth } from '@/hooks/useAuth'
import { createReturnRequest } from '@/services/returnRequestService'
import type { ReturnRequestType } from '@/types'

interface ReturnRequestFormProps {
  orderId: string
  onSuccess: () => void
  onCancel: () => void
}

export default function ReturnRequestForm({
  orderId,
  onSuccess,
  onCancel,
}: ReturnRequestFormProps) {
  const { user } = useAuth()
  const [type, setType] = useState<ReturnRequestType>('return')
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      await createReturnRequest(user.uid, orderId, type, reason, comment)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-gray-50 p-4">
      <h3 className="font-semibold">Request Return or Exchange</h3>

      <Select
        label="Request Type"
        name="type"
        value={type}
        onChange={(e) => setType(e.target.value as ReturnRequestType)}
        options={[
          { value: 'return', label: 'Return' },
          { value: 'exchange', label: 'Exchange' },
        ]}
      />

      <Input
        label="Reason"
        name="reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
        placeholder="e.g. Wrong size, defective item"
      />

      <Textarea
        label="Additional Comments"
        name="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Describe the issue in detail..."
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

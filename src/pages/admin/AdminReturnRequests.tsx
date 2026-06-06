import { useEffect, useState } from 'react'
import Loader from '@/components/ui/Loader'
import {
  subscribeToAllReturnRequests,
  updateReturnRequestStatus,
} from '@/services/returnRequestService'
import type { ReturnRequest, ReturnRequestStatus } from '@/types'

const STATUS_STYLES: Record<ReturnRequestStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  resolved: 'bg-blue-100 text-blue-800',
}

export default function AdminReturnRequests() {
  const [requests, setRequests] = useState<ReturnRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToAllReturnRequests(
      (data) => {
        setRequests(data)
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsubscribe
  }, [])

  const handleUpdate = async (id: string, status: ReturnRequestStatus) => {
    setUpdatingId(id)
    try {
      await updateReturnRequestStatus(id, status)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <Loader label="Loading return requests..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-charcoal">
          Return & Exchange Requests
        </h1>
        <p className="mt-1 text-gray-600">Review and resolve customer requests</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Request</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Order</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Reason</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No return or exchange requests yet.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="align-top hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleString('en-IN')}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs">
                      {request.orderId.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-4 capitalize">{request.type}</td>
                    <td className="px-4 py-4">
                      <p className="font-medium">{request.reason}</p>
                      {request.comment && (
                        <p className="mt-1 text-xs text-gray-500">{request.comment}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[request.status]}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {request.status === 'pending' ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={updatingId === request.id}
                            onClick={() => handleUpdate(request.id, 'approved')}
                            className="rounded-md bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === request.id}
                            onClick={() => handleUpdate(request.id, 'rejected')}
                            className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : request.status === 'approved' ? (
                        <button
                          type="button"
                          disabled={updatingId === request.id}
                          onClick={() => handleUpdate(request.id, 'resolved')}
                          className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

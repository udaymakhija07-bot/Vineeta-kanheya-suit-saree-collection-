import { useEffect, useState } from 'react'
import Loader from '@/components/ui/Loader'
import { getAllCustomers } from '@/services/customerService'
import type { UserProfile } from '@/types'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAllCustomers()
      .then(setCustomers)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load customers'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label="Loading customers..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-charcoal">Customers</h1>
        <p className="mt-1 text-gray-600">Registered users on your store</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Addresses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.uid} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{customer.displayName || '—'}</td>
                    <td className="px-4 py-3">{customer.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                          customer.role === 'admin'
                            ? 'bg-brand-gold/30 text-brand-charcoal'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{customer.addresses?.length ?? 0}</td>
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

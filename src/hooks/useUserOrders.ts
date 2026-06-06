import { useEffect, useRef, useState } from 'react'
import { subscribeToUserOrders } from '@/services/orderService'
import type { Order } from '@/types'

export function useUserOrders(userId: string | undefined, authInitialized = true) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastOrdersRef = useRef<Order[]>([])

  useEffect(() => {
    if (!authInitialized) {
      return
    }

    if (!userId) {
      setOrders([])
      lastOrdersRef.current = []
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const unsubscribe = subscribeToUserOrders(
      userId,
      (data) => {
        lastOrdersRef.current = data
        setOrders(data)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        if (lastOrdersRef.current.length > 0) {
          setOrders(lastOrdersRef.current)
        }
        setLoading(false)
      },
    )

    return unsubscribe
  }, [userId, authInitialized])

  return { orders, loading, error }
}

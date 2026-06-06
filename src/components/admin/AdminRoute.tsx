import { Navigate, Outlet } from 'react-router-dom'
import Loader from '@/components/ui/Loader'
import { useAuth } from '@/hooks/useAuth'
import { isUserAdmin } from '@/services/authService'

export default function AdminRoute() {
  const { user, profile, loading } = useAuth()

  if (loading) return <Loader label="Checking access..." />

  if (!user) {
    return <Navigate to="/login?redirect=/admin" replace />
  }

  if (!isUserAdmin(profile, user.email)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { getUserProfile } from '@/services/authService'
import type { UserProfile } from '@/types'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  /** True until Firebase finishes the initial auth state check. */
  loading: boolean
  /** True after the first onAuthStateChanged callback completes. */
  initialized: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const authEpochRef = useRef(0)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const epoch = ++authEpochRef.current

      setUser(firebaseUser)

      if (!firebaseUser) {
        setProfile(null)
        setLoading(false)
        setInitialized(true)
        return
      }

      setLoading(true)

      void getUserProfile(firebaseUser.uid)
        .then((userProfile) => {
          if (authEpochRef.current !== epoch) return
          setProfile(userProfile)
        })
        .catch(() => {
          if (authEpochRef.current !== epoch) return
          setProfile(null)
        })
        .finally(() => {
          if (authEpochRef.current !== epoch) return
          setLoading(false)
          setInitialized(true)
        })
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({ user, profile, loading, initialized }),
    [user, profile, loading, initialized],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}

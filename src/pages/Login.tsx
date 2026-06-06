import { FormEvent, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { loginUser, registerUser } from '@/services/authService'
import { isFirebaseConfigured, getMissingFirebaseEnvVars } from '@/config/env'
import { getAuthErrorMessage } from '@/utils/authErrors'

export default function Login() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const redirect = searchParams.get('redirect') || '/account'
  const firebaseReady = isFirebaseConfigured()
  const missingEnvVars = getMissingFirebaseEnvVars()

  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (!firebaseReady) {
      setError(getAuthErrorMessage(new Error('auth/api-key-not-valid')))
      return
    }

    setLoading(true)
    try {
      if (isRegister) {
        await registerUser(form.email, form.password, form.name)
      } else {
        await loginUser(form.email, form.password)
      }
      navigate(redirect)
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-app flex min-h-[60vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-semibold text-brand-maroon">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {isRegister
            ? 'Register with your email to shop and track orders.'
            : 'Sign in with your email and password.'}
        </p>

        {!firebaseReady && (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">Firebase is not connected</p>
            <ul className="mt-2 list-inside list-disc text-xs">
              {missingEnvVars.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegister && (
            <Input
              label="Full Name"
              name="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}
          <Input
            label="Email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading || !firebaseReady} className="w-full">
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </Button>
          <p className="text-center text-sm text-gray-600">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister)
                setError('')
              }}
              className="font-semibold text-brand-maroon hover:underline"
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link to="/" className="text-gray-500 hover:text-brand-maroon">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}

import { isFirebaseConfigured, getMissingFirebaseEnvVars } from '@/config/env'

export function getAuthErrorMessage(error: unknown): string {
  if (!isFirebaseConfigured()) {
    const missing = getMissingFirebaseEnvVars()
    return (
      `Firebase is not configured. Update your .env file with real values for: ${missing.join(', ')}. ` +
      'Get them from Firebase Console → Project Settings → General → Your apps → Web app.'
    )
  }

  const message = error instanceof Error ? error.message : 'Authentication failed'

  if (message.includes('auth/api-key-not-valid')) {
    return (
      'Invalid Firebase API key. Replace VITE_FIREBASE_API_KEY in .env with the real apiKey from ' +
      'Firebase Console, then restart the dev server (npm run dev).'
    )
  }

  if (message.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.'
  }

  if (message.includes('auth/email-already-in-use')) {
    return 'An account with this email already exists. Try logging in instead.'
  }

  if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password')) {
    return 'Incorrect email or password.'
  }

  if (message.includes('auth/weak-password')) {
    return 'Password must be at least 6 characters.'
  }

  return message.replace(/^Firebase: Error \(|\)\.?$/g, '')
}

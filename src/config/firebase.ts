import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  connectAuthEmulator,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, connectStorageEmulator, type FirebaseStorage } from 'firebase/storage'
import { getAppEnv, getMissingFirebaseEnvVars, isFirebaseConfigured } from '@/config/env'

function createFirebaseApp(): FirebaseApp {
  const { firebase, useEmulator } = getAppEnv()

  if (!isFirebaseConfigured() && !useEmulator) {
    const missing = getMissingFirebaseEnvVars()
    console.error(
      `[Firebase] Missing or placeholder env vars: ${missing.join(', ')}`
    )
  }

  return initializeApp(firebase)
}

const app = createFirebaseApp()

export const auth: Auth = getAuth(app)
export const db: Firestore = getFirestore(app)
export const storage: FirebaseStorage = getStorage(app)

void setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('[Firebase Auth] Could not set persistence:', err)
})

if (getAppEnv().useEmulator) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectStorageEmulator(storage, '127.0.0.1', 9199)
}

export default app

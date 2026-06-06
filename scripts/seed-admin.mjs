/**
 * Creates the admin user in Firebase Auth + Firestore.
 * Run after filling real Firebase values in .env:
 *   npm run seed:admin
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getFirestore, setDoc } from 'firebase/firestore'

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env')
  const env = {}

  try {
    const content = readFileSync(envPath, 'utf8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
    }
  } catch {
    console.error('Could not read .env file. Create one from .env.example first.')
    process.exit(1)
  }

  return env
}

const env = loadEnvFile()
const placeholders = new Set([
  'your_api_key',
  'your_project.firebaseapp.com',
  'your_project_id',
  'your_project.appspot.com',
  'your_sender_id',
  'your_app_id',
])

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

const missing = Object.entries({
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  VITE_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
  VITE_FIREBASE_APP_ID: firebaseConfig.appId,
}).filter(([, value]) => !value || placeholders.has(value))

if (missing.length) {
  console.error('Missing or placeholder Firebase env vars:')
  missing.forEach(([key]) => console.error(`  - ${key}`))
  console.error('\nAdd real values from Firebase Console to .env, then rerun.')
  process.exit(1)
}

const adminEmail = (env.VITE_ADMIN_EMAIL || 'udaymakhija07@gmail.com').toLowerCase()
const adminPassword = env.ADMIN_SEED_PASSWORD

if (!adminPassword) {
  console.error('Set ADMIN_SEED_PASSWORD in .env before running seed:admin')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

try {
  const credential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    email: adminEmail,
    displayName: 'Admin',
    role: 'admin',
    addresses: [],
  })
  console.log(`Admin account created: ${adminEmail}`)
} catch (error) {
  const code = error && typeof error === 'object' && 'code' in error ? error.code : null
  if (code === 'auth/email-already-in-use') {
    const credential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
    await setDoc(
      doc(db, 'users', credential.user.uid),
      {
        uid: credential.user.uid,
        email: adminEmail,
        displayName: 'Admin',
        role: 'admin',
        addresses: [],
      },
      { merge: true },
    )
    console.log(`Admin account already exists. Updated Firestore profile: ${adminEmail}`)
  } else {
    const message = error instanceof Error ? error.message : String(error)
    console.error(message)
    process.exit(1)
  }
}

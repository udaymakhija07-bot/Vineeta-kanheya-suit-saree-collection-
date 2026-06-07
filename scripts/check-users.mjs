import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

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
  } catch (err) {
    console.error('Error reading env file:', err)
  }
  return env
}

const env = loadEnvFile()
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

const adminEmail = 'udayprakashmakija@gmail.com'
const adminPassword = env.ADMIN_SEED_PASSWORD

console.log('Running users list diagnostics as:', adminEmail)
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

try {
  await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
  console.log('Admin login successful.')
  
  const querySnapshot = await getDocs(collection(db, 'users'))
  console.log('--- ALL USERS IN FIRESTORE ---')
  querySnapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data())
  })
  console.log('------------------------------')
} catch (e) {
  console.error('Diagnostics Error:', e.message)
}
process.exit(0)

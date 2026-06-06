/**
 * Validates Vite env vars before production builds on Vercel/CI.
 * Loads `.env` locally so checks match what Vite will read during build.
 */

import { existsSync, readFileSync } from 'node:fs'

const PLACEHOLDER_VALUES = new Set([
  'your_api_key',
  'your_project.firebaseapp.com',
  'your_project_id',
  'your_project.appspot.com',
  'your_sender_id',
  'your_app_id',
  'your_cloud_name',
  'your_upload_preset',
])

const REQUIRED_FIREBASE = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
]

const RECOMMENDED = ['VITE_ADMIN_EMAIL']

function isPlaceholder(value) {
  if (!value) return true
  const trimmed = value.trim()
  return PLACEHOLDER_VALUES.has(trimmed) || trimmed.startsWith('your_')
}

function read(name) {
  return (process.env[name] ?? '').trim()
}

function loadDotEnv() {
  if (!existsSync('.env')) return

  const content = readFileSync('.env', 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

loadDotEnv()

const isVercel = process.env.VERCEL === '1'
const isCi = process.env.CI === 'true'

if (!isVercel && !isCi) {
  const missing = REQUIRED_FIREBASE.filter((name) => isPlaceholder(read(name)))
  if (missing.length > 0) {
    console.warn(
      `[verify-env] Local build: missing Firebase vars (${missing.join(', ')}). ` +
        'Set them in .env or Vercel project settings before deploying.',
    )
  }
  process.exit(0)
}

const missingFirebase = REQUIRED_FIREBASE.filter((name) => isPlaceholder(read(name)))
const missingRecommended = RECOMMENDED.filter((name) => isPlaceholder(read(name)))

if (missingFirebase.length > 0) {
  console.error('\n[verify-env] Production build blocked — missing Firebase env vars:\n')
  for (const name of missingFirebase) {
    console.error(`  - ${name}`)
  }
  console.error(
    '\nAdd these in Vercel → Project → Settings → Environment Variables.\n' +
      'All Firebase client keys must use the VITE_ prefix for Vite to embed them at build time.\n',
  )
  process.exit(1)
}

if (missingRecommended.length > 0) {
  console.warn(
    `[verify-env] Warning: recommended vars not set: ${missingRecommended.join(', ')}`,
  )
}

if (read('VITE_USE_FIREBASE_EMULATOR') === 'true') {
  console.warn(
    '[verify-env] Warning: VITE_USE_FIREBASE_EMULATOR=true is ignored in production builds.',
  )
}

console.log('[verify-env] Firebase environment variables OK for production build.')

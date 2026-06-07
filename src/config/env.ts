const PLACEHOLDER_VALUES = new Set([
  'your_api_key',
  'your_project.firebaseapp.com',
  'your_project_id',
  'your_project.appspot.com',
  'your_sender_id',
  'your_app_id',
])

export interface FirebaseEnvConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

export interface CloudinaryEnvConfig {
  cloudName: string
  uploadPreset: string
}

export interface AppEnvConfig {
  firebase: FirebaseEnvConfig
  adminEmail: string
  useEmulator: boolean
  cloudinary: CloudinaryEnvConfig
}

function readEnv(name: string): string {
  return (import.meta.env[name] as string | undefined)?.trim() ?? ''
}

function isPlaceholder(value: string): boolean {
  return !value || PLACEHOLDER_VALUES.has(value) || value.startsWith('your_')
}

export function getFirebaseEnv(): FirebaseEnvConfig {
  return {
    apiKey: readEnv('VITE_FIREBASE_API_KEY'),
    authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: readEnv('VITE_FIREBASE_APP_ID'),
  }
}

export function getMissingFirebaseEnvVars(): string[] {
  const env = getFirebaseEnv()
  const labels: Record<keyof FirebaseEnvConfig, string> = {
    apiKey: 'VITE_FIREBASE_API_KEY',
    authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
    projectId: 'VITE_FIREBASE_PROJECT_ID',
    storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
    appId: 'VITE_FIREBASE_APP_ID',
  }

  return (Object.keys(env) as (keyof FirebaseEnvConfig)[])
    .filter((key) => isPlaceholder(env[key]))
    .map((key) => labels[key])
}

export function isFirebaseConfigured(): boolean {
  return getMissingFirebaseEnvVars().length === 0
}

export function getCloudinaryConfig(): CloudinaryEnvConfig {
  return {
    cloudName: readEnv('VITE_CLOUDINARY_CLOUD_NAME'),
    uploadPreset: readEnv('VITE_CLOUDINARY_UPLOAD_PRESET'),
  }
}

export function isCloudinaryConfigured(): boolean {
  const { cloudName, uploadPreset } = getCloudinaryConfig()
  return Boolean(cloudName && uploadPreset && !isPlaceholder(cloudName))
}

/** True when running a production Vite build (e.g. Vercel deploy). */
export function isProductionBuild(): boolean {
  return import.meta.env.PROD
}

export function getAppEnv(): AppEnvConfig {
  const emulatorRequested = readEnv('VITE_USE_FIREBASE_EMULATOR') === 'true'

  return {
    firebase: getFirebaseEnv(),
    adminEmail: readEnv('VITE_ADMIN_EMAIL').toLowerCase(),
    // Never connect to local emulators on Vercel/production builds.
    useEmulator: !import.meta.env.PROD && emulatorRequested,
    cloudinary: getCloudinaryConfig(),
  }
}

export function isAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase()
  const adminEmails = [
    readEnv('VITE_ADMIN_EMAIL').toLowerCase(),
    'tusharmakhija@gmail.com',
    'udaymakhija07@gmail.com',
    'udayprakashmakija@gmail.com',
  ].filter(Boolean)

  return adminEmails.includes(normalized)
}

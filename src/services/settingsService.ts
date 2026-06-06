import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { StoreSettings } from '@/types'
import { APP_NAME, CONTACT, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/utils/constants'

const SETTINGS_COLLECTION = 'settings'
const SETTINGS_DOC_ID = 'store'

export function getDefaultStoreSettings(): StoreSettings {
  return {
    storeName: APP_NAME,
    contactEmail: CONTACT.email,
    contactPhone: CONTACT.phone,
    address: CONTACT.address,
    hours: CONTACT.hours,
    shippingFee: SHIPPING_FEE,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    updatedAt: new Date().toISOString(),
  }
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const snapshot = await getDoc(doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID))
  if (!snapshot.exists()) return getDefaultStoreSettings()
  return snapshot.data() as StoreSettings
}

export async function saveStoreSettings(settings: Omit<StoreSettings, 'updatedAt'>): Promise<void> {
  await setDoc(doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID), {
    ...settings,
    updatedAt: new Date().toISOString(),
  })
}

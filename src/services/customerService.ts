import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { UserProfile } from '@/types'

const USERS_COLLECTION = 'users'

export async function getAllCustomers(): Promise<UserProfile[]> {
  const snapshot = await getDocs(collection(db, USERS_COLLECTION))

  return snapshot.docs
    .map((docSnap) => {
      const data = docSnap.data() as UserProfile
      return { ...data, uid: docSnap.id }
    })
    .sort((a, b) => a.email.localeCompare(b.email))
}

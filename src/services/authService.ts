import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { isAdminEmail } from '@/config/env'
import type { UserProfile } from '@/types'

function buildUserProfile(uid: string, email: string, displayName: string): UserProfile {
  return {
    uid,
    email,
    displayName,
    role: isAdminEmail(email) ? 'admin' : 'customer',
    addresses: [],
    createdAt: new Date().toISOString(),
  }
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string,
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName })

  const profile = buildUserProfile(credential.user.uid, email, displayName)
  await setDoc(doc(db, 'users', credential.user.uid), profile)
  return credential.user
}

export async function loginUser(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function logoutUser(): Promise<void> {
  await signOut(auth)
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, 'users', uid))
  if (!snapshot.exists()) return null
  return snapshot.data() as UserProfile
}

export function isUserAdmin(profile: UserProfile | null, email?: string | null): boolean {
  if (profile?.role === 'admin') return true
  if (email) return isAdminEmail(email)
  return false
}

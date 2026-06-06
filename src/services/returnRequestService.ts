import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { ReturnRequest, ReturnRequestStatus, ReturnRequestType } from '@/types'

const COLLECTION = 'returnRequests'

export async function createReturnRequest(
  userId: string,
  orderId: string,
  type: ReturnRequestType,
  reason: string,
  comment: string,
): Promise<string> {
  const request: Omit<ReturnRequest, 'id'> = {
    userId,
    orderId,
    type,
    reason,
    comment,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  const docRef = await addDoc(collection(db, COLLECTION), request)
  return docRef.id
}

export async function getUserReturnRequests(userId: string): Promise<ReturnRequest[]> {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(
    (docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as ReturnRequest,
  )
}

export function subscribeToAllReturnRequests(
  callback: (requests: ReturnRequest[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))

  return onSnapshot(
    q,
    (snapshot) => {
      const requests = snapshot.docs.map(
        (docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as ReturnRequest,
      )
      callback(requests)
    },
    (err) => onError?.(err),
  )
}

export async function updateReturnRequestStatus(
  requestId: string,
  status: ReturnRequestStatus,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, requestId), { status })
}

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  limit,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Product, ProductFilters, ProductInput } from '@/types'

const PRODUCTS_COLLECTION = 'products'

function mapProductDoc(docSnap: { id: string; data: () => Record<string, unknown> }): Product {
  const data = docSnap.data()
  const stockQuantity = typeof data.stockQuantity === 'number' ? data.stockQuantity : data.inStock ? 1 : 0

  return {
    id: docSnap.id,
    name: (data.name as string) ?? '',
    description: (data.description as string) ?? '',
    price: (data.price as number) ?? 0,
    compareAtPrice: data.compareAtPrice as number | undefined,
    images: (data.images as string[]) ?? [],
    brand: data.brand as Product['brand'],
    category: data.category as Product['category'],
    sizes: (data.sizes as string[]) ?? ['Free Size'],
    colors: (data.colors as string[]) ?? ['Default'],
    stockQuantity,
    inStock: stockQuantity > 0,
    featured: Boolean(data.featured),
    tags: (data.tags as string[]) ?? [],
    createdAt: (data.createdAt as string) ?? new Date().toISOString(),
  }
}

function applyClientFilters(products: Product[], filters: ProductFilters): Product[] {
  let result = products

  if (filters.brand) {
    result = result.filter((p) => p.brand === filters.brand)
  }

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category)
  }

  if (filters.inStock) {
    result = result.filter((p) => p.inStock)
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!)
  }

  if (filters.search) {
    const term = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.tags.some((tag) => tag.toLowerCase().includes(term)),
    )
  }

  return result
}

function buildProductPayload(input: ProductInput, createdAt?: string) {
  return {
    name: input.name.trim(),
    description: input.description.trim(),
    price: input.price,
    compareAtPrice: input.compareAtPrice || null,
    images: input.images,
    brand: input.brand,
    category: input.category,
    sizes: input.sizes.length > 0 ? input.sizes : ['Free Size'],
    colors: input.colors.length > 0 ? input.colors : ['Default'],
    stockQuantity: input.stockQuantity,
    inStock: input.stockQuantity > 0,
    featured: input.featured,
    tags: input.tags,
    ...(createdAt ? { createdAt } : {}),
  }
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  const products = snapshot.docs.map((docSnap) => mapProductDoc(docSnap))
  return applyClientFilters(products, filters)
}

export async function getProductById(id: string): Promise<Product | null> {
  const snapshot = await getDoc(doc(db, PRODUCTS_COLLECTION, id))
  if (!snapshot.exists()) return null
  return mapProductDoc(snapshot)
}

export async function getFeaturedProducts(count = 8): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where('featured', '==', true),
    orderBy('createdAt', 'desc'),
    limit(count),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => mapProductDoc(docSnap))
}

export async function getProductsByBrand(brand: Product['brand']): Promise<Product[]> {
  return getProducts({ brand })
}

export async function createProduct(input: ProductInput): Promise<string> {
  const createdAt = new Date().toISOString()
  const docRef = await addDoc(
    collection(db, PRODUCTS_COLLECTION),
    buildProductPayload(input, createdAt),
  )
  return docRef.id
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), buildProductPayload(input))
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id))
}

export function subscribeToProducts(
  callback: (products: Product[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'))

  return onSnapshot(
    q,
    (snapshot) => {
      const products = snapshot.docs.map((docSnap) => mapProductDoc(docSnap))
      callback(products)
    },
    (err) => onError?.(err),
  )
}

export function subscribeToProduct(
  id: string,
  callback: (product: Product | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, PRODUCTS_COLLECTION, id),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }
      callback(mapProductDoc(snapshot))
    },
    (err) => onError?.(err),
  )
}

export function subscribeToFeaturedProducts(
  count: number,
  callback: (products: Product[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where('featured', '==', true),
    orderBy('createdAt', 'desc'),
    limit(count),
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const products = snapshot.docs.map((docSnap) => mapProductDoc(docSnap))
      callback(products)
    },
    (err) => onError?.(err),
  )
}

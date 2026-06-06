export type Brand = 'vineeta' | 'kanheya'

export type ProductCategory =
  | 'suits'
  | 'sarees'
  | 'lehengas'
  | 'kurtis'
  | 'dupattas'
  | 'accessories'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  brand: Brand
  category: ProductCategory
  sizes: string[]
  colors: string[]
  stockQuantity: number
  inStock: boolean
  featured: boolean
  tags: string[]
  createdAt: string
}

export interface ProductInput {
  name: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  brand: Brand
  category: ProductCategory
  sizes: string[]
  colors: string[]
  stockQuantity: number
  featured: boolean
  tags: string[]
}

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

export type UserRole = 'admin' | 'customer'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: UserRole
  phone?: string
  phoneDigits?: string
  addresses: Address[]
  createdAt?: string
}

export interface Address {
  id: string
  label: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export type PaymentStatus = 'verification_pending' | 'verified' | 'rejected'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type PaymentMethod = 'qr_upi' | 'cod' | string

export interface OrderItem {
  productId: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  shippingAddress: Address
  customerName: string
  customerPhone: string
  customerPhoneDigits?: string
  paymentMethod: PaymentMethod
  upiTransactionId?: string
  createdAt: string
}

export type ReturnRequestType = 'return' | 'exchange'

export type ReturnRequestStatus = 'pending' | 'approved' | 'rejected' | 'resolved'

export interface ReturnRequest {
  id: string
  userId: string
  orderId: string
  type: ReturnRequestType
  reason: string
  comment: string
  status: ReturnRequestStatus
  createdAt: string
}

export interface ProductFilters {
  brand?: Brand
  category?: ProductCategory
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  search?: string
}

export interface StoreSettings {
  storeName: string
  contactEmail: string
  contactPhone: string
  address: string
  hours: string
  shippingFee: number
  freeShippingThreshold: number
  updatedAt: string
}

import type { Brand } from '@/types'

export const APP_NAME = 'Vineeta Suit Collection & Kanheya Saree Centre'

export const ADMIN_WHATSAPP = '9997722799'

export const STORE_UPI_ID = '9808943799@ptaxis'

export const ESTIMATED_DELIVERY_DAYS = 5

export const ORDER_TRACKING_STEPS = [
  { key: 'placed', label: 'Order Placed' },
  { key: 'payment_verified', label: 'Payment Verified' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out For Delivery' },
  { key: 'delivered', label: 'Delivered' },
] as const

export const ORDER_STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out For Delivery' },
  { key: 'delivered', label: 'Delivered' },
]

export const BRANDS: Record<
  Brand,
  { name: string; tagline: string; description: string }
> = {
  vineeta: {
    name: 'Vineeta Suit Collection',
    tagline: 'Elegant suits for every celebration',
    description:
      'Curated designer suits, shararas, and ethnic sets crafted for weddings, festivals, and special occasions.',
  },
  kanheya: {
    name: 'Kanheya Saree Centre',
    tagline: 'Timeless sarees, woven with tradition',
    description:
      'A heritage collection of silk, cotton, and designer sarees from across India.',
  },
}

export const CATEGORIES = [
  { value: 'suits', label: 'Suits & Sets' },
  { value: 'sarees', label: 'Sarees' },
  { value: 'lehengas', label: 'Lehengas' },
  { value: 'kurtis', label: 'Kurtis' },
  { value: 'dupattas', label: 'Dupattas' },
  { value: 'accessories', label: 'Accessories' },
] as const

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']

export const SHIPPING_FEE = 99
export const FREE_SHIPPING_THRESHOLD = 999

export const CONTACT = {
  phone: '+91 99977 22799',
  emails: ['tusharmakhija@gmail.com', 'udaymakhija07@gmail.com'],
  email: 'tusharmakhija@gmail.com',
  address: 'Gandhi Mandi, Sirsaganj, Firozabad, Uttar Pradesh, 283151',
  hours: '10:00 AM to 9:00 PM · Open All Days',
}

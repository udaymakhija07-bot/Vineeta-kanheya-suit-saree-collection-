interface BadgeProps {
  children: string
  variant?: 'default' | 'sale' | 'new' | 'out-of-stock'
}

const variants = {
  default: 'bg-brand-maroon/10 text-brand-maroon',
  sale: 'bg-red-100 text-red-700',
  new: 'bg-brand-gold/20 text-brand-charcoal',
  'out-of-stock': 'bg-gray-100 text-gray-600',
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  )
}

import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { formatPrice, calculateDiscount } from '@/utils/formatPrice'
import { BRANDS } from '@/utils/constants'
import Badge from '@/components/ui/Badge'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = calculateDiscount(product.price, product.compareAtPrice)

  return (
    <Link to={`/product/${product.id}`} className="group card overflow-hidden transition hover:shadow-md">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-rose/30">
        <img
          src={product.images[0] || '/images/placeholder-product.svg'}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {discount > 0 && <Badge variant="sale">{`${discount}% OFF`}</Badge>}
          {product.featured && <Badge variant="new">Featured</Badge>}
          {!product.inStock && <Badge variant="out-of-stock">Out of Stock</Badge>}
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-maroon">
          {BRANDS[product.brand].name}
        </p>
        <h3 className="mt-1 line-clamp-2 font-medium text-brand-charcoal group-hover:text-brand-maroon">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-semibold text-brand-charcoal">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

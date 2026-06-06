import type { Product } from '@/types'
import ProductCard from './ProductCard'
import Loader from '@/components/ui/Loader'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  emptyMessage?: string
}

export default function ProductGrid({
  products,
  loading = false,
  emptyMessage = 'No products found.',
}: ProductGridProps) {
  if (loading) return <Loader label="Loading products..." />

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

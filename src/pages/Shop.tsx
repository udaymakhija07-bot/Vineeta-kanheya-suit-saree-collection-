import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductFilters from '@/components/product/ProductFilters'
import ProductGrid from '@/components/product/ProductGrid'
import Loader from '@/components/ui/Loader'
import { useProducts } from '@/hooks/useProducts'
import type { Brand, ProductCategory } from '@/types'

export default function Shop() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')

  const brand = (searchParams.get('brand') as Brand) || undefined
  const category = (searchParams.get('category') as ProductCategory) || undefined

  const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>(brand)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | undefined>(
    category,
  )

  const productFilters = useMemo(
    () => ({
      brand: selectedBrand,
      category: selectedCategory,
      search,
    }),
    [selectedBrand, selectedCategory, search],
  )

  const { products, loading, error } = useProducts(productFilters)

  const productCount = useMemo(() => products.length, [products])

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-brand-maroon">Shop</h1>
        <p className="mt-2 text-gray-600">
          Browse our full collection of suits, sarees, and ethnic wear
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside>
          <ProductFilters
            brand={selectedBrand}
            category={selectedCategory}
            search={search}
            onBrandChange={setSelectedBrand}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearch}
          />
        </aside>

        <div>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <p className="mb-4 text-sm text-gray-500">
            {productCount} product{productCount !== 1 ? 's' : ''} found
          </p>

          {loading ? (
            <Loader label="Loading products..." />
          ) : productCount === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-500">
              No products found. Try adjusting your filters.
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  )
}

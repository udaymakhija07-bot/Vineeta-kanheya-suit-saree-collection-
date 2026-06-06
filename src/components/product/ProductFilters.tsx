import type { ProductCategory, Brand } from '@/types'
import { CATEGORIES } from '@/utils/constants'

interface ProductFiltersProps {
  brand?: Brand
  category?: ProductCategory
  search: string
  onBrandChange: (brand?: Brand) => void
  onCategoryChange: (category?: ProductCategory) => void
  onSearchChange: (search: string) => void
}

export default function ProductFilters({
  brand,
  category,
  search,
  onBrandChange,
  onCategoryChange,
  onSearchChange,
}: ProductFiltersProps) {
  return (
    <div className="card space-y-4 p-4">
      <div>
        <label htmlFor="search" className="mb-1 block text-sm font-medium">
          Search
        </label>
        <input
          id="search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="brand" className="mb-1 block text-sm font-medium">
          Brand
        </label>
        <select
          id="brand"
          value={brand || ''}
          onChange={(e) => onBrandChange((e.target.value as Brand) || undefined)}
          className="input-field"
        >
          <option value="">All Brands</option>
          <option value="vineeta">Vineeta Suit Collection</option>
          <option value="kanheya">Kanheya Saree Centre</option>
        </select>
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          value={category || ''}
          onChange={(e) =>
            onCategoryChange((e.target.value as ProductCategory) || undefined)
          }
          className="input-field"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

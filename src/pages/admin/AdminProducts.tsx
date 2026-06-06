import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Loader from '@/components/ui/Loader'
import Select from '@/components/ui/Select'
import { useAdminProducts } from '@/hooks/useProducts'
import { deleteProduct } from '@/services/productService'
import type { ProductCategory } from '@/types'
import { BRANDS, CATEGORIES } from '@/utils/constants'
import { formatPrice } from '@/utils/formatPrice'

export default function AdminProducts() {
  const { products, loading, error } = useAdminProducts()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ProductCategory | ''>('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (category && product.category !== category) return false
      if (search) {
        const term = search.toLowerCase()
        return (
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term)
        )
      }
      return true
    })
  }, [products, search, category])

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return

    setDeletingId(id)
    try {
      await deleteProduct(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <Loader label="Loading products..." />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-charcoal">Products</h1>
          <p className="mt-1 text-gray-600">Manage your store catalog</p>
        </div>
        <Link to="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="card p-4">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <Input
            label="Search products"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, description, or brand..."
          />
          <Select
            label="Filter by category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory | '')}
            options={[
              { value: '', label: 'All categories' },
              ...CATEGORIES.map((cat) => ({ value: cat.value, label: cat.label })),
            ]}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Product</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Brand</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Price</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Stock</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Featured</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0] || '/images/placeholder-product.svg'}
                          alt=""
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-brand-charcoal">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            Added {new Date(product.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{BRANDS[product.brand].name}</td>
                    <td className="px-4 py-3 capitalize">{product.category}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{formatPrice(product.price)}</p>
                      {product.compareAtPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          product.inStock
                            ? product.stockQuantity <= 5
                              ? 'text-yellow-700'
                              : 'text-green-700'
                            : 'text-red-600'
                        }
                      >
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">{product.featured ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deletingId === product.id}
                          className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === product.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

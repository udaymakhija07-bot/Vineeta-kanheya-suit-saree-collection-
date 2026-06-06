import { Link, useParams } from 'react-router-dom'
import ProductForm from '@/components/admin/ProductForm'
import Loader from '@/components/ui/Loader'
import { useProduct } from '@/hooks/useProducts'

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const { product, loading, error } = useProduct(id)

  if (isEdit && loading) {
    return <Loader label="Loading product..." />
  }

  if (isEdit && !product) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-xl font-semibold">Product not found</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Link to="/admin/products" className="text-brand-maroon hover:underline">
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-charcoal">
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h1>
        <p className="mt-1 text-gray-600">
          {isEdit ? 'Update product details and images' : 'Create a new product for your storefront'}
        </p>
      </div>

      <div className="card p-6">
        <ProductForm mode={isEdit ? 'edit' : 'create'} product={product ?? undefined} />
      </div>
    </div>
  )
}

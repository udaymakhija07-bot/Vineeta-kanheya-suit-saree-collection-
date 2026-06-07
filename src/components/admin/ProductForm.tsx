import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CloudinaryImageUpload from '@/components/admin/CloudinaryImageUpload'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { createProduct, updateProduct } from '@/services/productService'
import type { Brand, Product, ProductCategory, ProductInput } from '@/types'
import { BRANDS, CATEGORIES, SIZES } from '@/utils/constants'

interface ProductFormProps {
  product?: Product
  mode: 'create' | 'edit'
}

const emptyForm: ProductInput = {
  name: '',
  description: '',
  price: 0,
  compareAtPrice: undefined,
  images: [],
  brand: 'vineeta',
  category: 'suits',
  sizes: ['Free Size'],
  colors: ['Default'],
  stockQuantity: 0,
  featured: false,
  tags: [],
}

import { useAuth } from '@/hooks/useAuth'

export default function ProductForm({ product, mode }: ProductFormProps) {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<ProductInput>(
    product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          images: product.images,
          brand: product.brand,
          category: product.category,
          sizes: product.sizes,
          colors: product.colors,
          stockQuantity: product.stockQuantity,
          featured: product.featured,
          tags: product.tags,
        }
      : emptyForm,
  )
  const [sizesInput, setSizesInput] = useState(product?.sizes.join(', ') ?? 'Free Size')
  const [colorsInput, setColorsInput] = useState(product?.colors.join(', ') ?? 'Default')
  const [tagsInput, setTagsInput] = useState(product?.tags.join(', ') ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateField = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const parseList = (value: string) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!form.name.trim()) {
      setError('Product name is required.')
      return
    }

    if (form.price <= 0) {
      setError('Price must be greater than zero.')
      return
    }

    if (form.images.length === 0) {
      setError('Upload at least one product image.')
      return
    }

    setSaving(true)

    try {
      const payload: ProductInput = {
        ...form,
        sizes: parseList(sizesInput),
        colors: parseList(colorsInput),
        tags: parseList(tagsInput),
      }

      if (mode === 'create') {
        await createProduct(payload)
      } else {
        await updateProduct(product!.id, payload)
      }

      navigate('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Input
          label="Product Name"
          name="name"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
        />

        <Select
          label="Brand"
          name="brand"
          value={form.brand}
          onChange={(e) => updateField('brand', e.target.value as Brand)}
          options={Object.entries(BRANDS).map(([value, brand]) => ({
            value,
            label: brand.name,
          }))}
        />

        <Select
          label="Category"
          name="category"
          value={form.category}
          onChange={(e) => updateField('category', e.target.value as ProductCategory)}
          options={CATEGORIES.map((cat) => ({ value: cat.value, label: cat.label }))}
        />

        <Input
          label="Price (₹)"
          name="price"
          type="number"
          min="0"
          step="1"
          value={form.price || ''}
          onChange={(e) => updateField('price', Number(e.target.value))}
          required
        />

        <Input
          label="Discount Price (₹)"
          name="compareAtPrice"
          type="number"
          min="0"
          step="1"
          value={form.compareAtPrice ?? ''}
          onChange={(e) =>
            updateField('compareAtPrice', e.target.value ? Number(e.target.value) : undefined)
          }
        />

        <Input
          label="Stock Quantity"
          name="stockQuantity"
          type="number"
          min="0"
          step="1"
          value={form.stockQuantity}
          onChange={(e) => updateField('stockQuantity', Number(e.target.value))}
          required
        />
      </div>

      <Textarea
        label="Description"
        name="description"
        value={form.description}
        onChange={(e) => updateField('description', e.target.value)}
        required
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Input
          label="Sizes (comma separated)"
          name="sizes"
          value={sizesInput}
          onChange={(e) => setSizesInput(e.target.value)}
          placeholder={SIZES.join(', ')}
        />
        <Input
          label="Colors (comma separated)"
          name="colors"
          value={colorsInput}
          onChange={(e) => setColorsInput(e.target.value)}
        />
        <Input
          label="Tags (comma separated)"
          name="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-brand-charcoal">Product Images</p>
        <CloudinaryImageUpload
          images={form.images}
          onChange={(images) => updateField('images', images)}
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => updateField('featured', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-brand-maroon focus:ring-brand-maroon"
        />
        <span className="text-sm font-medium text-brand-charcoal">Featured Product</span>
      </label>

      <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate('/admin/products')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

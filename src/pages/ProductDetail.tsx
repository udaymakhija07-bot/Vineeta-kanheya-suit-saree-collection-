import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Loader from '@/components/ui/Loader'
import { useCart } from '@/hooks/useCart'
import { useProduct } from '@/hooks/useProducts'
import { BRANDS } from '@/utils/constants'
import { formatPrice, calculateDiscount } from '@/utils/formatPrice'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { product, loading, error } = useProduct(id)
  const { addItem } = useCart()

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [added, setAdded] = useState(false)

  if (loading) return <Loader label="Loading product..." />

  if (!product) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <Link to="/shop" className="mt-4 inline-block text-brand-maroon hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const currentSize = selectedSize || product.sizes[0] || 'Free Size'
  const currentColor = selectedColor || product.colors[0] || 'Default'
  const discount = calculateDiscount(product.price, product.compareAtPrice)

  const handleAddToCart = () => {
    if (!product.inStock) return

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/images/placeholder-product.svg',
      size: currentSize,
      color: currentColor,
      quantity: 1,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="container-app py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-xl bg-brand-rose/30">
            <img
              src={product.images[selectedImage] || '/images/placeholder-product.svg'}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                    selectedImage === index ? 'border-brand-maroon' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-maroon">
            {BRANDS[product.brand].name}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                {discount > 0 && <Badge variant="sale">{`${discount}% OFF`}</Badge>}
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-gray-600">{product.description}</p>

          <p className="mt-4 text-sm text-gray-500">
            {product.inStock
              ? `${product.stockQuantity} in stock`
              : 'Currently out of stock'}
          </p>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-md border px-4 py-2 text-sm transition ${
                    currentSize === size
                      ? 'border-brand-maroon bg-brand-maroon text-white'
                      : 'border-gray-300 hover:border-brand-maroon'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-md border px-4 py-2 text-sm transition ${
                    currentColor === color
                      ? 'border-brand-maroon bg-brand-maroon text-white'
                      : 'border-gray-300 hover:border-brand-maroon'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button onClick={handleAddToCart} disabled={!product.inStock}>
              {product.inStock ? (added ? 'Added to Cart!' : 'Add to Cart') : 'Out of Stock'}
            </Button>
            <Link to="/cart">
              <Button variant="secondary">View Cart</Button>
            </Link>
          </div>

          {!product.inStock && (
            <p className="mt-4 text-sm text-red-600">This item is currently out of stock.</p>
          )}
        </div>
      </div>
    </div>
  )
}

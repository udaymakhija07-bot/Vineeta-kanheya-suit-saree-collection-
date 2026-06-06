import { useEffect, useMemo, useState } from 'react'
import {
  getProducts,
  subscribeToFeaturedProducts,
  subscribeToProduct,
  subscribeToProducts,
} from '@/services/productService'
import type { Product, ProductFilters } from '@/types'

function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  let result = products

  if (filters.brand) {
    result = result.filter((p) => p.brand === filters.brand)
  }

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category)
  }

  if (filters.inStock) {
    result = result.filter((p) => p.inStock)
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!)
  }

  if (filters.search) {
    const term = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.tags.some((tag) => tag.toLowerCase().includes(term)),
    )
  }

  return result
}

function parseFiltersKey(filtersKey: string): ProductFilters {
  try {
    return JSON.parse(filtersKey) as ProductFilters
  } catch {
    return {}
  }
}

export function useProducts(filters: ProductFilters = {}, realtime = true) {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filtersKey = JSON.stringify(filters)
  const parsedFilters = useMemo(() => parseFiltersKey(filtersKey), [filtersKey])

  // Realtime: one Firestore listener per mount; filter client-side when filters change.
  useEffect(() => {
    if (!realtime) return

    setLoading(true)
    setError(null)

    const unsubscribe = subscribeToProducts(
      (data) => {
        setAllProducts(data)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [realtime])

  // One-time fetch path (non-realtime).
  useEffect(() => {
    if (realtime) return

    let cancelled = false

    async function fetchProducts() {
      setLoading(true)
      setError(null)

      try {
        const data = await getProducts(parsedFilters)
        if (!cancelled) setFetchedProducts(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProducts()
    return () => {
      cancelled = true
    }
  }, [filtersKey, realtime, parsedFilters])

  const products = useMemo(() => {
    if (!realtime) return fetchedProducts
    return applyFilters(allProducts, parsedFilters)
  }, [realtime, allProducts, fetchedProducts, parsedFilters])

  return { products, loading, error }
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const unsubscribe = subscribeToProduct(
      id,
      (data) => {
        setProduct((prev) => {
          if (prev?.id === data?.id && JSON.stringify(prev) === JSON.stringify(data)) {
            return prev
          }
          return data
        })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [id])

  return { product, loading, error }
}

export function useFeaturedProducts(count = 8) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToFeaturedProducts(
      count,
      (data) => {
        setProducts((prev) => {
          if (prev.length === data.length && prev.every((p, i) => p.id === data[i]?.id)) {
            return prev
          }
          return data
        })
        setLoading(false)
      },
      () => setLoading(false),
    )

    return unsubscribe
  }, [count])

  return { products, loading }
}

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (data) => {
        setProducts((prev) => {
          if (prev.length === data.length && prev.every((p, i) => p.id === data[i]?.id)) {
            return prev
          }
          return data
        })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  const stats = useMemo(
    () => ({
      total: products.length,
      featured: products.filter((p) => p.featured).length,
      outOfStock: products.filter((p) => !p.inStock).length,
      lowStock: products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 5).length,
    }),
    [products],
  )

  return { products, loading, error, stats }
}

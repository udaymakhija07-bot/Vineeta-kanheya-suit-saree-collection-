import { Link } from 'react-router-dom'
import BrandShowcase from '@/components/brand/BrandShowcase'
import ProductGrid from '@/components/product/ProductGrid'
import Button from '@/components/ui/Button'
import Loader from '@/components/ui/Loader'
import { useFeaturedProducts } from '@/hooks/useProducts'
import { APP_NAME } from '@/utils/constants'

export default function Home() {
  const { products: featured, loading } = useFeaturedProducts(4)

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-maroon to-brand-maroon/80 text-white">
        <div className="container-app py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
            Welcome to
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl">
            {APP_NAME}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">
            Discover premium suits from Vineeta and exquisite sarees from Kanheya —
            curated ethnic wear for weddings, festivals, and everyday elegance.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/shop">
              <Button className="bg-white text-brand-maroon hover:bg-brand-cream">
                Shop All
              </Button>
            </Link>
            <Link to="/shop?brand=vineeta">
              <Button variant="secondary" className="border-white text-white hover:bg-white/10">
                Vineeta Suits
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container-app py-16">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-semibold text-brand-maroon">
            Featured Collection
          </h2>
          <p className="mt-2 text-gray-600">Handpicked pieces from both our brands</p>
        </div>
        {loading ? (
          <Loader label="Loading featured products..." />
        ) : featured.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-500">
            No featured products yet. Check back soon!
          </div>
        ) : (
          <ProductGrid products={featured} />
        )}
        <div className="mt-8 text-center">
          <Link to="/shop">
            <Button variant="secondary">View All Products</Button>
          </Link>
        </div>
      </section>

      <section className="container-app space-y-8 pb-16">
        <BrandShowcase brand="vineeta" />
        <BrandShowcase brand="kanheya" />
      </section>
    </div>
  )
}

import { Link } from 'react-router-dom'
import type { Brand } from '@/types'
import { BRANDS } from '@/utils/constants'
import Button from '@/components/ui/Button'

interface BrandShowcaseProps {
  brand: Brand
}

export default function BrandShowcase({ brand }: BrandShowcaseProps) {
  const info = BRANDS[brand]

  return (
    <section className="card overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="flex flex-col justify-center p-8 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
            Our Collection
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-brand-maroon">
            {info.name}
          </h2>
          <p className="mt-2 text-lg text-brand-charcoal/80">{info.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">{info.description}</p>
          <Link to={`/shop?brand=${brand}`} className="mt-6">
            <Button>Shop {brand === 'vineeta' ? 'Suits' : 'Sarees'}</Button>
          </Link>
        </div>
        <div
          className={`min-h-[280px] bg-gradient-to-br ${
            brand === 'vineeta'
              ? 'from-brand-maroon/20 to-brand-rose/40'
              : 'from-brand-gold/20 to-brand-rose/30'
          }`}
        />
      </div>
    </section>
  )
}

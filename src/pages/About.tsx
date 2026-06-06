import BrandShowcase from '@/components/brand/BrandShowcase'
import { APP_NAME, CONTACT } from '@/utils/constants'

export default function About() {
  return (
    <div className="container-app py-10">
      <h1 className="font-display text-3xl font-semibold text-brand-maroon">About Us</h1>
      <p className="mt-4 max-w-3xl leading-relaxed text-gray-600">
        {APP_NAME} brings together two beloved names in Indian ethnic fashion. Vineeta Suit
        Collection offers designer suits, shararas, and lehengas for every celebration, while
        Kanheya Saree Centre preserves the art of saree weaving with silks, cottons, and
        contemporary drapes from across the country.
      </p>

      <div className="mt-12 space-y-8">
        <BrandShowcase brand="vineeta" />
        <BrandShowcase brand="kanheya" />
      </div>

      <div className="mt-12 card p-8">
        <h2 className="font-display text-xl font-semibold">Our Promise</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          <li className="text-sm text-gray-600">
            <strong className="block text-brand-charcoal">Authentic Quality</strong>
            Curated fabrics and craftsmanship you can trust.
          </li>
          <li className="text-sm text-gray-600">
            <strong className="block text-brand-charcoal">Pan-India Delivery</strong>
            Secure packaging and reliable shipping nationwide.
          </li>
          <li className="text-sm text-gray-600">
            <strong className="block text-brand-charcoal">Personal Service</strong>
            Reach us at {CONTACT.phone} for styling help.
          </li>
        </ul>
      </div>
    </div>
  )
}

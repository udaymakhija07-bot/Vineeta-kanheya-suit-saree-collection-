import { Link } from 'react-router-dom'
import { APP_NAME, BRANDS, CONTACT } from '@/utils/constants'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-brand-charcoal text-gray-300">
      <div className="container-app grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-display text-lg font-semibold text-white">{APP_NAME}</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed">
            Two trusted names in ethnic fashion — premium suits from Vineeta and
            timeless sarees from Kanheya Saree Centre, delivered to your doorstep.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            Our Brands
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/shop?brand=vineeta" className="hover:text-brand-gold">
                {BRANDS.vineeta.name}
              </Link>
            </li>
            <li>
              <Link to="/shop?brand=kanheya" className="hover:text-brand-gold">
                {BRANDS.kanheya.name}
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-brand-gold">
                Shop All
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            Contact
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{CONTACT.phone}</li>
            {CONTACT.emails.map((email) => (
              <li key={email}>
                <a href={`mailto:${email}`} className="hover:text-brand-gold">
                  {email}
                </a>
              </li>
            ))}
            <li>{CONTACT.address}</li>
            <li>{CONTACT.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-maroon">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-brand-charcoal">Page not found</h1>
      <p className="mt-3 max-w-md text-gray-600">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
        <Link to="/shop">
          <Button variant="secondary">Browse Shop</Button>
        </Link>
      </div>
    </div>
  )
}

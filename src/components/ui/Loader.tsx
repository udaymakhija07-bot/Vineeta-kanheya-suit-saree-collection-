interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizes = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export default function Loader({ size = 'md', label = 'Loading...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-2 border-brand-maroon border-t-transparent`}
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  accent?: 'maroon' | 'gold' | 'green' | 'red' | 'gray'
}

const accentClasses = {
  maroon: 'border-brand-maroon/20 bg-brand-maroon/5 text-brand-maroon',
  gold: 'border-brand-gold/30 bg-brand-gold/10 text-brand-charcoal',
  green: 'border-green-200 bg-green-50 text-green-700',
  red: 'border-red-200 bg-red-50 text-red-700',
  gray: 'border-gray-200 bg-white text-brand-charcoal',
}

export default function StatCard({ label, value, hint, accent = 'gray' }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${accentClasses[accent]}`}>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  )
}

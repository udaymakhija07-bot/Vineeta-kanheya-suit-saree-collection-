import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Loader from '@/components/ui/Loader'
import Textarea from '@/components/ui/Textarea'
import {
  getDefaultStoreSettings,
  getStoreSettings,
  saveStoreSettings,
} from '@/services/settingsService'
import type { StoreSettings } from '@/types'

export default function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings>(getDefaultStoreSettings())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getStoreSettings()
      .then(setSettings)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  const updateField = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)

    try {
      await saveStoreSettings({
        storeName: settings.storeName,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        address: settings.address,
        hours: settings.hours,
        shippingFee: settings.shippingFee,
        freeShippingThreshold: settings.freeShippingThreshold,
      })
      setMessage('Settings saved successfully.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading settings..." />

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-charcoal">Settings</h1>
        <p className="mt-1 text-gray-600">Manage store information and shipping rules</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6 p-6">
        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          label="Store Name"
          name="storeName"
          value={settings.storeName}
          onChange={(e) => updateField('storeName', e.target.value)}
          required
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Contact Email"
            name="contactEmail"
            type="email"
            value={settings.contactEmail}
            onChange={(e) => updateField('contactEmail', e.target.value)}
            required
          />
          <Input
            label="Contact Phone"
            name="contactPhone"
            value={settings.contactPhone}
            onChange={(e) => updateField('contactPhone', e.target.value)}
            required
          />
        </div>

        <Textarea
          label="Store Address"
          name="address"
          value={settings.address}
          onChange={(e) => updateField('address', e.target.value)}
          required
        />

        <Input
          label="Business Hours"
          name="hours"
          value={settings.hours}
          onChange={(e) => updateField('hours', e.target.value)}
          required
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Shipping Fee (₹)"
            name="shippingFee"
            type="number"
            min="0"
            value={settings.shippingFee}
            onChange={(e) => updateField('shippingFee', Number(e.target.value))}
            required
          />
          <Input
            label="Free Shipping Threshold (₹)"
            name="freeShippingThreshold"
            type="number"
            min="0"
            value={settings.freeShippingThreshold}
            onChange={(e) => updateField('freeShippingThreshold', Number(e.target.value))}
            required
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}

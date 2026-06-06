import { FormEvent, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { CONTACT } from '@/utils/constants'
import { buildCustomerWhatsAppLink, openWhatsApp } from '@/utils/whatsapp'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="container-app py-10">
      <h1 className="font-display text-3xl font-semibold text-brand-maroon">Contact Us</h1>
      <p className="mt-2 text-gray-600">We'd love to hear from you. Visit us or send a message.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-semibold">Store Details</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li>
              <strong className="text-brand-charcoal">Phone:</strong> {CONTACT.phone}
            </li>
            <li>
              <strong className="text-brand-charcoal">Email:</strong>
              <ul className="mt-1">
                {CONTACT.emails.map((email) => (
                  <li key={email}>
                    <a href={`mailto:${email}`} className="text-brand-maroon hover:underline">
                      {email}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <strong className="text-brand-charcoal">Address:</strong> {CONTACT.address}
            </li>
            <li>
              <strong className="text-brand-charcoal">Hours:</strong> {CONTACT.hours}
            </li>
          </ul>
          <Button
            variant="secondary"
            className="mt-6"
            onClick={() => openWhatsApp(buildCustomerWhatsAppLink())}
          >
            Contact Store on WhatsApp
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <h2 className="font-semibold">Send a Message</h2>

          {submitted ? (
            <p className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
              Thank you! We'll get back to you soon.
            </p>
          ) : (
            <>
              <Input
                label="Name"
                name="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div className="space-y-1">
                <label htmlFor="message" className="block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field resize-none"
                />
              </div>
              <Button type="submit">Send Message</Button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

/** Normalize to last 10 digits for Indian mobile numbers. */
export function normalizePhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length <= 10) return digits
  return digits.slice(-10)
}

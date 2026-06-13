declare const emailBrand: unique symbol

/** Decoded contact address — do not construct manually. */
export type EmailAddress = string & { readonly [emailBrand]: 'EmailAddress' }

export type MailtoOptions = {
  subject?: string
  body?: string
  cc?: EmailAddress | readonly EmailAddress[]
  bcc?: EmailAddress | readonly EmailAddress[]
}

/** XOR-encoded parts — no plain address in source or DOM until client decode. */
const XOR_KEY = 17
const ENCODED_LOCAL = [97, 116, 101, 116, 99, 117, 120, 127, 120, 98, 39, 32, 32] as const
const ENCODED_DOMAIN = [118, 124, 112, 120, 125, 63, 114, 126, 124] as const

function decodePart(codes: readonly number[]): string {
  return String.fromCharCode(...codes.map((c) => c ^ XOR_KEY))
}

function assertEmail(value: string): asserts value is EmailAddress {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error('Invalid contact email')
  }
}

let cached: EmailAddress | null = null

export function decodeEmail(): EmailAddress {
  if (cached) return cached
  const address = `${decodePart(ENCODED_LOCAL)}@${decodePart(ENCODED_DOMAIN)}`
  assertEmail(address)
  cached = address
  return cached
}

export function buildMailtoHref(email: EmailAddress, options?: MailtoOptions): string {
  const params = new URLSearchParams()

  if (options?.subject) params.set('subject', options.subject)
  if (options?.body) params.set('body', options.body)

  const appendList = (key: 'cc' | 'bcc', value: EmailAddress | readonly EmailAddress[]) => {
    const list = Array.isArray(value) ? value : [value]
    if (list.length > 0) params.set(key, list.join(','))
  }

  if (options?.cc) appendList('cc', options.cc)
  if (options?.bcc) appendList('bcc', options.bcc)

  const qs = params.toString()
  return qs ? `mailto:${email}?${qs}` : `mailto:${email}`
}

export function openMailto(options?: MailtoOptions): void {
  window.location.assign(buildMailtoHref(decodeEmail(), options))
}

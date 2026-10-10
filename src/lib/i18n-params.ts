import { notFound } from 'next/navigation'
import { isLocale, LOCALES, type Locale } from '@/lib/locale'

export function generateLocaleStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return locale
}

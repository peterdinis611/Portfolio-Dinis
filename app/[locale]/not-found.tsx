import type { Metadata } from 'next'
import { LocaleNotFound } from '@/components/notion/LocaleNotFound'
import { translations } from '@/i18n/translations'
import { DEFAULT_LOCALE } from '@/lib/locale'

export const metadata: Metadata = {
  title: translations[DEFAULT_LOCALE].ui.notionNotFoundTitle,
  robots: { index: false, follow: false },
}

export default function LocaleNotFoundPage() {
  return <LocaleNotFound />
}

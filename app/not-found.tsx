import type { Metadata } from 'next'
import { LocaleNotFound } from '@/components/notion/LocaleNotFound'
import { AppProviders } from '@/context/AppProviders'
import { NotionShell } from '@/components/notion/NotionShell'
import { LocaleLang } from '@/components/LocaleLang'
import { translations } from '@/i18n/translations'
import { DEFAULT_LOCALE } from '@/lib/locale'

export const metadata: Metadata = {
  title: translations[DEFAULT_LOCALE].ui.notionNotFoundTitle,
  robots: { index: false, follow: false },
}

/** Root 404 when `notFound()` is thrown outside a valid locale layout (e.g. bad locale). */
export default function RootNotFound() {
  return (
    <AppProviders>
      <LocaleLang locale={DEFAULT_LOCALE} />
      <NotionShell locale={DEFAULT_LOCALE}>
        <LocaleNotFound />
      </NotionShell>
    </AppProviders>
  )
}

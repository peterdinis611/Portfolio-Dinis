import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { LocaleLang } from '@/components/LocaleLang'
import { NotionShell } from '@/components/notion/NotionShell'
import { AppProviders } from '@/context/AppProviders'
import { isLocale, LOCALES } from '@/lib/locale'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <AppProviders>
      <LocaleLang locale={locale} />
      <NotionShell locale={locale}>{children}</NotionShell>
    </AppProviders>
  )
}

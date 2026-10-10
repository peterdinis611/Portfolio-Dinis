import { Suspense } from 'react'
import { JsonLd } from '@/components/JsonLd'
import { NotesPage } from '@/components/notion/pages/NotesPage'
import { resolveLocale } from '@/lib/i18n-params'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return buildMetadata(locale, { page: 'notes' })
}

export default async function NotesRoute({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return (
    <>
      <JsonLd locale={locale} route={{ page: 'notes' }} />
      <Suspense fallback={null}>
        <NotesPage lang={locale} />
      </Suspense>
    </>
  )
}

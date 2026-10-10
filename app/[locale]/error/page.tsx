import { JsonLd } from '@/components/JsonLd'
import { ErrorPage } from '@/components/notion/pages/ErrorPage'
import { resolveLocale } from '@/lib/i18n-params'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return buildMetadata(locale, { page: 'error' })
}

export default async function ErrorDemoRoute({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return (
    <>
      <JsonLd locale={locale} route={{ page: 'error' }} />
      <ErrorPage lang={locale} demo />
    </>
  )
}

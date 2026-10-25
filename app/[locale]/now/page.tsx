import { JsonLd } from '@/components/JsonLd'
import { NowPage } from '@/components/notion/pages/NowPage'
import { resolveLocale } from '@/lib/i18n-params'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return buildMetadata(locale, { page: 'now' })
}

export default async function NowRoute({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return (
    <>
      <JsonLd locale={locale} route={{ page: 'now' }} />
      <NowPage lang={locale} />
    </>
  )
}

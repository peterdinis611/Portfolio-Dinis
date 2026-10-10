import { JsonLd } from '@/components/JsonLd'
import { AboutPage } from '@/components/notion/pages/AboutPage'
import { resolveLocale } from '@/lib/i18n-params'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return buildMetadata(locale, { page: 'about' })
}

export default async function AboutRoute({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return (
    <>
      <JsonLd locale={locale} route={{ page: 'about' }} />
      <AboutPage lang={locale} />
    </>
  )
}

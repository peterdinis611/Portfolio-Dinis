import { JsonLd } from '@/components/JsonLd'
import { ExperiencePage } from '@/components/notion/pages/ExperiencePage'
import { resolveLocale } from '@/lib/i18n-params'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return buildMetadata(locale, { page: 'experience' })
}

export default async function ExperienceRoute({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return (
    <>
      <JsonLd locale={locale} route={{ page: 'experience' }} />
      <ExperiencePage lang={locale} />
    </>
  )
}

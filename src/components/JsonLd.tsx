import type { Locale } from '@/lib/locale'
import type { PortfolioRoute } from '@/lib/portfolio-route'
import { buildJsonLd, getSiteUrl } from '@/lib/seo'

/** Server-rendered JSON-LD for prerendered HTML / crawlers. */
export function JsonLd({ locale, route }: { locale: Locale; route: PortfolioRoute }) {
  const data = buildJsonLd(locale, locale, route, getSiteUrl())
  if (!data) return null
  return (
    <script
      id="portfolio-jsonld"
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD from trusted local data
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

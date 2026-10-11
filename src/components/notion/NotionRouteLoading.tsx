'use client'

import { usePathname } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'
import { isLocale } from '@/lib/locale'

/** Lightweight in-pane loading state for App Router `loading.tsx`. */
export function NotionRouteLoading({ lang }: { lang?: Lang } = {}) {
  const pathname = usePathname()
  const segment = pathname?.split('/').filter(Boolean)[0]
  const resolved: Lang = lang ?? (isLocale(segment) ? segment : 'sk')
  const label = translations[resolved].ui.preloadLoading

  return (
    <div className="notion-route-loading" role="status" aria-live="polite" aria-label={label}>
      <div className="notion-route-loading__card">
        <Spinner size="lg" label={label} />
        <p className="notion-route-loading__label">{label}</p>
      </div>
    </div>
  )
}

'use client'

import { Spinner } from '@/components/ui/spinner'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'

/** In-pane overlay while a client navigation is in flight. */
export function NotionRoutePending({ lang, active }: { lang: Lang; active: boolean }) {
  if (!active) return null

  const label = translations[lang].ui.preloadLoading

  return (
    <div className="notion-route-pending" role="status" aria-live="polite" aria-busy="true" aria-label={label}>
      <div className="notion-route-pending__card">
        <Spinner size="lg" label={label} />
        <p className="notion-route-pending__label">{label}</p>
      </div>
    </div>
  )
}

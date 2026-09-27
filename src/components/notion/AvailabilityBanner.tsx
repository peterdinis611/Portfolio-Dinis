import { availability, availabilityTone } from '@/data/availability'
import type { Lang } from '@/i18n/translations'
import { translations } from '@/i18n/translations'
import { pageHref } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'

export function AvailabilityBanner({ lang }: { lang: Lang }) {
  const ui = translations[lang].ui
  const tone = availabilityTone[availability.status]

  return (
    <aside
      className="my-4 flex flex-col gap-3 rounded-[10px] border border-[rgba(55,53,47,0.09)] bg-[color-mix(in_srgb,var(--editor-surface)_92%,var(--primary))] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-[rgba(255,255,255,0.1)]"
      aria-label={ui.availabilityNow}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
            {ui.availabilityNow}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[4px] px-1.5 py-0.5 text-[12px] font-medium',
              tone.badge,
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} aria-hidden />
            {tone.label[lang]}
          </span>
        </div>
        <p className="mt-1.5 text-[15px] font-semibold tracking-[-0.01em] text-foreground">
          {availability.headline[lang]}
        </p>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{availability.workMode[lang]}</p>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
          {availability.detail[lang]}
        </p>
      </div>
      <a
        href={pageHref('contact')}
        className="inline-flex shrink-0 items-center justify-center rounded-[6px] bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {ui.getInTouch}
      </a>
    </aside>
  )
}

'use client'

import { availabilityTone } from '@/data/availability'
import { formatNowUpdated, nowSnapshot } from '@/data/now'
import { type Lang, translations } from '@/i18n/translations'
import { pageHref } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import { BlockHeading, BlockText, PageShell, PageTitle } from '../blocks'
import { MotionSection } from '../motion'
import { NotionLink } from '../NotionLink'
import { BlockCalloutRich } from '../notion-blocks'
import { PageCover } from '../PageCover'

function SnapshotList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-foreground">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function NowPage({ lang }: { lang: Lang }) {
  const ui = translations[lang].ui
  const tone = availabilityTone[nowSnapshot.availability.status]
  const updated = formatNowUpdated(lang, nowSnapshot.updated)

  return (
    <PageShell cover={<PageCover variant="about" />}>
      <MotionSection>
        <PageTitle icon="📡" description={ui.nowIntro}>
          {ui.now}
        </PageTitle>
        <p className="mt-2 text-[13px] text-muted-foreground">
          {ui.nowUpdated.replace('{date}', updated)}
        </p>
      </MotionSection>

      <MotionSection delay={0.05} className="mt-5">
        <aside
          className="flex flex-col gap-3 rounded-[10px] border border-[rgba(55,53,47,0.09)] bg-[color-mix(in_srgb,var(--editor-surface)_92%,var(--primary))] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-[rgba(255,255,255,0.1)]"
          aria-label={ui.nowAvailability}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium tracking-[0.06em] text-muted-foreground uppercase">
                {ui.nowAvailability}
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
              {nowSnapshot.availability.headline[lang]}
            </p>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {nowSnapshot.availability.workMode[lang]}
            </p>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
              {nowSnapshot.availability.detail[lang]}
            </p>
          </div>
          <NotionLink
            href={pageHref(lang, 'contact')}
            className="inline-flex shrink-0 items-center justify-center rounded-[6px] bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {ui.getInTouch}
          </NotionLink>
        </aside>
      </MotionSection>

      <MotionSection delay={0.1} className="mt-8">
        <BlockHeading>{ui.nowFocusing}</BlockHeading>
        <SnapshotList items={nowSnapshot.focusing.map((item) => item[lang])} />
      </MotionSection>

      <MotionSection delay={0.14} className="mt-8">
        <BlockHeading>{ui.nowTeaching}</BlockHeading>
        <SnapshotList items={nowSnapshot.teaching.map((item) => item[lang])} />
      </MotionSection>

      <MotionSection delay={0.18} className="mt-8">
        <BlockHeading>{ui.nowLooking}</BlockHeading>
        <SnapshotList items={nowSnapshot.lookingFor.map((item) => item[lang])} />
      </MotionSection>

      <MotionSection delay={0.22} className="mt-8">
        <BlockHeading>{ui.nowNotLooking}</BlockHeading>
        <BlockCalloutRich variant="warning">
          <BlockText>{nowSnapshot.notLookingFor.map((item) => item[lang]).join(' · ')}</BlockText>
        </BlockCalloutRich>
      </MotionSection>
    </PageShell>
  )
}

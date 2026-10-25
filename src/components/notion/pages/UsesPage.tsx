'use client'

import { usesGroups } from '@/data/uses'
import { type Lang, translations } from '@/i18n/translations'
import { BlockHeading, BlockText, PageShell, PageTitle } from '../blocks'
import { MotionItem, MotionSection } from '../motion'
import { PageCover } from '../PageCover'
import { PageCtaPanel } from '../PageCtaPanel'

export function UsesPage({ lang }: { lang: Lang }) {
  const ui = translations[lang].ui

  return (
    <PageShell cover={<PageCover variant="tech" />}>
      <MotionSection>
        <PageTitle icon="🛠️" description={ui.usesIntro}>
          {ui.uses}
        </PageTitle>
      </MotionSection>

      <MotionSection delay={0.06}>
        <BlockText>{ui.usesLead}</BlockText>
      </MotionSection>

      {usesGroups.map((group, index) => (
        <MotionItem key={group.id} delay={0.1 + index * 0.05} className="mt-8">
          <section
            id={`uses-${group.id}`}
            className="rounded-[6px] border border-border bg-card/30 p-3.5"
          >
            <BlockHeading className="mt-0">{group.title[lang]}</BlockHeading>
            <ul className="mt-3 space-y-3">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className="border-t border-[rgba(55,53,47,0.06)] pt-3 first:border-0 first:pt-0 dark:border-[rgba(255,255,255,0.06)]"
                >
                  <p className="text-[15px] font-medium text-foreground">{item.name}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                    {item.detail[lang]}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </MotionItem>
      ))}

      <MotionSection delay={0.2} className="mt-12">
        <PageCtaPanel lang={lang} />
      </MotionSection>
    </PageShell>
  )
}

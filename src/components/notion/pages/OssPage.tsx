'use client'

import { ArrowUpRight } from 'lucide-react'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { ossCommunity, ossRepos, ossTalks } from '@/data/oss'
import { type Lang, translations } from '@/i18n/translations'
import { pageHref } from '@/lib/portfolio-route'
import { BlockHeading, BlockText, PageShell, PageTitle } from '../blocks'
import { MotionSection } from '../motion'
import { NotionLink } from '../NotionLink'
import { BlockCalloutRich } from '../notion-blocks'
import { PageCover } from '../PageCover'
import { PageCtaPanel } from '../PageCtaPanel'

export function OssPage({ lang }: { lang: Lang }) {
  const ui = translations[lang].ui

  return (
    <PageShell cover={<PageCover variant="projects" />}>
      <MotionSection>
        <PageTitle icon="🌿" description={ui.ossIntro}>
          {ui.oss}
        </PageTitle>
      </MotionSection>

      <MotionSection delay={0.06} className="mt-6">
        <BlockCalloutRich variant="idea" title={ui.ossCommunity}>
          <ul className="mt-1 space-y-1.5">
            {ossCommunity.map((item) => (
              <li key={item.sk} className="text-[14px] leading-relaxed text-foreground/90">
                {item[lang]}
              </li>
            ))}
          </ul>
        </BlockCalloutRich>
      </MotionSection>

      <MotionSection delay={0.1} className="mt-10">
        <BlockHeading>{ui.ossRepos}</BlockHeading>
        <BlockText>{ui.ossReposLead}</BlockText>
        <ul className="mt-4 space-y-2">
          {ossRepos.map((repo) => (
            <li key={repo.id}>
              <ExternalLink
                href={repo.href}
                className="group flex items-start justify-between gap-3 rounded-[6px] px-2 py-2.5 transition-colors hover:bg-[rgba(55,53,47,0.06)] dark:hover:bg-[rgba(255,255,255,0.06)]"
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[15px] font-medium text-foreground">
                    {repo.title}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-0.5 block text-[13px] text-muted-foreground">
                    {repo.blurb[lang]}
                  </span>
                </span>
              </ExternalLink>
            </li>
          ))}
        </ul>
      </MotionSection>

      <MotionSection delay={0.14} className="mt-10">
        <BlockHeading>{ui.ossTalks}</BlockHeading>
        <ul className="mt-3 space-y-3">
          {ossTalks.map((talk) => (
            <li
              key={talk.id}
              className="rounded-[6px] border border-[rgba(55,53,47,0.09)] px-3.5 py-3 dark:border-[rgba(255,255,255,0.1)]"
            >
              <p className="text-[15px] font-medium text-foreground">{talk.title}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                {talk.blurb[lang]}
              </p>
              {talk.toContact ? (
                <NotionLink
                  href={pageHref(lang, 'contact')}
                  className="mt-2 inline-flex text-[13px] font-medium text-primary hover:underline"
                >
                  {ui.getInTouch}
                </NotionLink>
              ) : talk.href ? (
                <ExternalLink
                  href={talk.href}
                  className="mt-2 inline-flex text-[13px] font-medium text-primary hover:underline"
                >
                  {talk.title}
                </ExternalLink>
              ) : null}
            </li>
          ))}
        </ul>
      </MotionSection>

      <MotionSection delay={0.2} className="mt-12">
        <PageCtaPanel lang={lang} />
      </MotionSection>
    </PageShell>
  )
}

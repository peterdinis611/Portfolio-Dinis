import { type Lang, translations } from '@/i18n/translations'
import {
  BackLink,
  BlockHeading,
  BlockText,
  PageShell,
} from '../blocks'
import { MotionSection } from '../motion'
import {
  BlockCalloutRich,
  BlockDividerDots,
  BlockPageLink,
  BlockQuote,
} from '../notion-blocks'
import { getNotionPages } from '../nav'

export function NotFoundPage({
  lang,
  attemptedPath,
}: {
  lang: Lang
  attemptedPath?: string
}) {
  const ui = translations[lang].ui
  const pages = getNotionPages(lang)

  return (
    <PageShell>
      <MotionSection>
        <BackLink href="#about">{ui.notionBackHome}</BackLink>

        <div
          className="mb-5 flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-md border border-border bg-muted/35 text-[2.35rem] shadow-sm"
          aria-hidden
        >
          🔍
        </div>

        <h1 className="mb-2 text-[2.125rem] font-bold leading-[1.2] tracking-[-0.02em] text-foreground">
          {ui.notionNotFoundHeading}
        </h1>
        <BlockText className="mb-1">{ui.notionNotFoundBody}</BlockText>

        {attemptedPath ? (
          <p className="mb-6 font-mono text-sm text-muted-foreground">
            <span className="text-foreground/70">{ui.notionNotFoundPathLabel}: </span>
            #{attemptedPath}
          </p>
        ) : (
          <div className="mb-6" />
        )}

        <BlockQuote>{ui.notionNotFoundQuote}</BlockQuote>
        <BlockCalloutRich icon="💡" title={ui.notionNotFoundTipTitle} variant="idea">
          {ui.notionNotFoundTipBody}
        </BlockCalloutRich>
      </MotionSection>

      <MotionSection delay={0.08} className="mt-8">
        <BlockDividerDots />
        <BlockHeading className="mt-0">{ui.notionNotFoundExplore}</BlockHeading>
        <div className="flex flex-col gap-0.5">
          {pages.map((page) => (
            <BlockPageLink key={page.id} href={`#${page.id}`} icon={page.icon} label={page.label} />
          ))}
        </div>
      </MotionSection>
    </PageShell>
  )
}

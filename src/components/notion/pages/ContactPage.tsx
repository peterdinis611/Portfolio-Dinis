import type { ReactNode } from 'react'
import { BrandIcon } from '@/components/icons/BrandIcon'
import { Button } from '@/components/ui/button'
import { EmailDisplay } from '@/components/ui/EmailDisplay'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { MailtoLink } from '@/components/ui/MailtoLink'
import { ProfilePhoto } from '@/components/ui/ProfilePhoto'
import { profile, socials } from '@/data/portfolio'
import { type Lang, translations } from '@/i18n/translations'
import { notionPageBlocks } from '@/i18n/notion-blocks-content'
import {
  BlockCallout,
  BlockDivider,
  BlockHeading,
  BlockText,
  PageShell,
  PageTitle,
  PropertyRow,
  PropertyTable,
} from '../blocks'
import { MotionSection } from '../motion'
import {
  BlockBookmark,
  BlockCalloutRich,
  BlockColumns,
  BlockPageLink,
  BlockQuote,
  BlockTodoList,
  BlockToggleGroup,
} from '../notion-blocks'
import { getNotionPages } from '../nav'
import { PageCover } from '../PageCover'

function ContactValue({
  label,
  value,
  href,
  mailto,
}: {
  label: string
  value?: ReactNode
  href?: string
  mailto?: boolean
}) {
  const inner = <span className="inline-flex items-center gap-2">{value}</span>
  if (mailto) {
    return (
      <MailtoLink className="text-primary hover:underline" aria-label={label}>
        {inner}
      </MailtoLink>
    )
  }
  if (href) {
    return (
      <a className="text-primary hover:underline" href={href}>
        {inner}
      </a>
    )
  }
  return inner
}

export function ContactPage({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const ui = t.ui
  const blocks = notionPageBlocks[lang].contact
  const navPages = getNotionPages(lang).filter((page) => page.id !== 'contact')

  return (
    <PageShell cover={<PageCover variant="contact" />}>
      <MotionSection className="pt-2">
        <PageTitle icon="✉️">{ui.contact}</PageTitle>
      </MotionSection>

      <MotionSection delay={0.06}>
        <BlockColumns
          cols={2}
          children={[
            <div key="lead">
              <BlockQuote>{ui.contactLead}</BlockQuote>
              <BlockText>{ui.contactText}</BlockText>
            </div>,
            <div key="cta" className="flex flex-col items-start justify-center gap-3">
              <ProfilePhoto className="h-16 w-16 overflow-hidden rounded-full border-2 border-background shadow-md" />
              <MailtoLink>
                <Button className="h-10 px-5 shadow-md">{ui.endCta}</Button>
              </MailtoLink>
            </div>,
          ]}
        />
      </MotionSection>

      <MotionSection delay={0.1} className="mt-6">
        <PropertyTable>
          <PropertyRow icon="✉️" label={ui.emailLabel}>
            <ContactValue label={ui.emailLabel} value={<EmailDisplay />} mailto />
          </PropertyRow>
          <PropertyRow icon="📞" label={ui.phoneLabel}>
            <ContactValue
              label={ui.phoneLabel}
              value={profile.phone}
              href={`tel:${profile.phoneHref}`}
            />
          </PropertyRow>
          <PropertyRow icon="📍" label={ui.locationLabel}>
            <ContactValue label={ui.locationLabel} value={ui.contactLocation} />
          </PropertyRow>
        </PropertyTable>
      </MotionSection>

      <MotionSection delay={0.14} className="mt-6">
        <BlockHeading>{blocks.faqTitle}</BlockHeading>
        <BlockToggleGroup
          items={blocks.faq.map((item) => ({
            title: item.title,
            body: <BlockText>{item.body}</BlockText>,
          }))}
        />
      </MotionSection>

      <MotionSection delay={0.18} className="mt-6">
        {blocks.bookmarks.map((bookmark) => (
          <BlockBookmark key={bookmark.href} {...bookmark} />
        ))}
      </MotionSection>

      <MotionSection delay={0.22} className="mt-6">
        <BlockCalloutRich icon="📋" title={blocks.nextStepsTitle} variant="info">
          <BlockTodoList items={blocks.nextSteps} />
        </BlockCalloutRich>
        <BlockCallout icon="💬" variant="idea">
          {t.profile.tagline}
        </BlockCallout>
      </MotionSection>

      <MotionSection delay={0.26} className="mt-6">
        <BlockDivider />
        <BlockHeading>{ui.followMe}</BlockHeading>
        <div className="flex flex-wrap items-center gap-3">
          <ul className="flex gap-2">
            {socials.map((s) => (
              <li key={s.name}>
                <ExternalLink
                  href={s.url}
                  aria-label={s.name}
                  title={s.name}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <BrandIcon slug={s.icon} className="h-4 w-4" label={s.name} />
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </MotionSection>

      <MotionSection delay={0.3} className="mt-6">
        <BlockText className="mb-2 font-semibold text-foreground">Pages</BlockText>
        {navPages.map((page) => (
          <BlockPageLink key={page.id} href={`#${page.id}`} icon={page.icon} label={page.label} />
        ))}
      </MotionSection>
    </PageShell>
  )
}

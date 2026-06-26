import type { ReactNode } from 'react'
import { BrandIcon } from '@/components/icons/BrandIcon'
import { Button } from '@/components/ui/button'
import { EmailDisplay } from '@/components/ui/EmailDisplay'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { MailtoLink } from '@/components/ui/MailtoLink'
import { ProfilePhoto } from '@/components/ui/ProfilePhoto'
import { profile, socials } from '@/data/portfolio'
import { type Lang, translations } from '@/i18n/translations'
import {
  BlockCallout,
  BlockText,
  PageShell,
  PageTitle,
  PropertyRow,
  PropertyTable,
} from '../blocks'
import { MotionSection } from '../motion'
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

  return (
    <PageShell cover={<PageCover variant="contact" />}>
      <MotionSection className="pt-2">
        <PageTitle icon="✉️">{ui.contact}</PageTitle>
      </MotionSection>

      <MotionSection delay={0.08}>
        <div className="overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <ProfilePhoto className="h-20 w-20 overflow-hidden rounded-xl border-2 border-background shadow-md" />
            <div className="flex-1">
              <p className="text-xl font-bold">{profile.name}</p>
              <p className="text-sm text-muted-foreground">{t.profile.title}</p>
              <p className="mt-2 text-sm leading-relaxed">{ui.contactLead}</p>
            </div>
            <MailtoLink>
              <Button className="h-11 shrink-0 px-6 shadow-md">{ui.endCta}</Button>
            </MailtoLink>
          </div>
        </div>
      </MotionSection>

      <MotionSection delay={0.14} className="mt-6">
        <BlockText>{ui.contactText}</BlockText>
        <BlockCallout icon="💬" variant="info">
          {t.profile.tagline}
        </BlockCallout>
      </MotionSection>

      <MotionSection delay={0.2} className="mt-6">
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

      <MotionSection delay={0.26} className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">{ui.followMe}</span>
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
    </PageShell>
  )
}

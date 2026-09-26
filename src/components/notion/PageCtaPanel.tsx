import { BrandIcon } from '@/components/icons/BrandIcon'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { MailtoLink } from '@/components/ui/MailtoLink'
import { socials } from '@/data/portfolio'
import { type Lang, translations } from '@/i18n/translations'
import { AboutCtaPanel } from './blocks'

type PageCtaPanelProps = {
  lang: Lang
}

export function PageCtaPanel({ lang }: PageCtaPanelProps) {
  const ui = translations[lang].ui
  const linkedIn = socials.find((s) => s.icon === 'linkedin')

  const title = ui.pageCtaTitle
  const body = ui.pageCtaBody

  return (
    <AboutCtaPanel
      title={title}
      body={body}
      action={
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <MailtoLink className="inline-flex items-center justify-center rounded-[4px] bg-primary px-3.5 py-2 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90">
            {ui.getInTouch}
          </MailtoLink>
          {linkedIn ? (
            <ExternalLink
              href={linkedIn.url}
              className="inline-flex items-center justify-center gap-1.5 rounded-[4px] px-2 py-1.5 text-[13px] font-medium text-[var(--link)] transition-colors hover:bg-[color-mix(in_srgb,var(--link)_10%,transparent)]"
            >
              <BrandIcon slug="linkedin" className="h-3.5 w-3.5" label="LinkedIn" />
              {ui.pageCtaLinkedIn}
            </ExternalLink>
          ) : null}
        </div>
      }
    />
  )
}

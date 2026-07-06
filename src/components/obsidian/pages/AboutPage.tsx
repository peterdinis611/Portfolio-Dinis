import { MailtoLink } from '@/components/ui/MailtoLink'
import { ProfilePhoto } from '@/components/ui/ProfilePhoto'
import { profile } from '@/data/portfolio'
import { portfolioStats } from '@/data/portfolio-meta'
import { type Lang, translations } from '@/i18n/translations'
import { obsidianPageBlocks } from '@/i18n/obsidian-blocks-content'
import { aboutTemplateContent } from '@/i18n/portfolio-template'
import {
  AboutCtaPanel,
  BioTagPills,
  BlockDivider,
  BlockHeading,
  BlockText,
  InfoFactGrid,
  PageNavPills,
  PageShell,
  PageTitle,
  SectionAnchorNav,
  SkillFeatureGrid,
  StatGrid,
} from '../blocks'
import { MotionSection } from '../motion'
import {
  BlockCalloutRich,
  BlockQuote,
  BlockTodoList,
  BlockToggleGroup,
} from '../obsidian-blocks'
import { getObsidianPages } from '../nav'

const statLabelKey = {
  years: 'statYears',
  roles: 'statRoles',
  products: 'statProducts',
  mentored: 'statMentored',
} as const

export function AboutPage({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const ui = t.ui
  const template = aboutTemplateContent[lang]
  const blocks = obsidianPageBlocks[lang].about
  const navPages = getObsidianPages(lang).filter((page) => page.id !== 'about')
  const bioTags = blocks.bioHighlight.split(' · ').map((tag) => tag.trim())

  const stats = portfolioStats.map((item) => ({
    value: item.value,
    label: ui[statLabelKey[item.id]],
  }))

  return (
    <PageShell>
      <MotionSection>
        <PageTitle fileName="about.md">{profile.name}</PageTitle>
        <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <ProfilePhoto className="h-20 w-20 overflow-hidden rounded-full border border-border sm:h-24 sm:w-24" priority />
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-foreground">{t.profile.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{template.aboutShort}</p>
          </div>
        </div>
        <BioTagPills items={bioTags} />
        <StatGrid items={stats} />
      </MotionSection>

      <MotionSection delay={0.06} className="mt-6">
        <BlockCalloutRich title={blocks.currentlyTitle} variant="info">
          {blocks.currentlyText}
        </BlockCalloutRich>
      </MotionSection>

      <MotionSection delay={0.08} className="mt-5">
        <SectionAnchorNav label={blocks.tocTitle} items={blocks.tocItems} />
      </MotionSection>

      <MotionSection delay={0.1} className="mt-6">
        <BlockQuote>{blocks.quote}</BlockQuote>
      </MotionSection>

      <MotionSection delay={0.13} className="mt-8" id="about-facts">
        <BlockHeading className="mt-0">{blocks.basicInfoTitle}</BlockHeading>
        <InfoFactGrid
          items={[
            {
              label: template.livesInLabel,
              value: template.profileFacts.livesIn,
              tone: 'rose',
            },
            {
              label: template.educationLabel,
              value: template.profileFacts.education,
              tone: 'yellow',
            },
            {
              label: template.speaksLabel,
              value: template.profileFacts.speaks,
              tone: 'blue',
            },
            {
              label: template.lovesLabel,
              value: template.profileFacts.loves,
              tone: 'sky',
            },
          ]}
        />
      </MotionSection>

      <MotionSection delay={0.16} className="mt-8" id="about-skills">
        <BlockHeading className="mt-0">{template.skillsTitle}</BlockHeading>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{template.skillsIntro}</p>
        <SkillFeatureGrid items={template.skills} />
      </MotionSection>

      <MotionSection delay={0.2} className="mt-8" id="about-approach">
        <BlockDivider />
        <BlockHeading>{blocks.approachTitle}</BlockHeading>
        <BlockTodoList items={blocks.approachTodos} />
        <BlockToggleGroup
          items={blocks.workingStyle.map((item) => ({
            title: item.title,
            body: <BlockText>{item.body}</BlockText>,
          }))}
          defaultOpenIndex={0}
        />
      </MotionSection>

      <MotionSection delay={0.24} className="mt-8">
        <AboutCtaPanel
          title={template.contactSection}
          body={template.contactShort}
          tagline={t.profile.tagline}
          action={
            <div className="flex flex-col gap-2 sm:items-end">
              <MailtoLink className="obsidian-wikilink inline-flex items-center border border-[color-mix(in_srgb,var(--link)_35%,var(--border))] bg-[color-mix(in_srgb,var(--link)_10%,transparent)] px-3 py-1.5 transition-colors hover:bg-[color-mix(in_srgb,var(--link)_16%,transparent)]">
                {ui.getInTouch} →
              </MailtoLink>
              <a href="#contact" className="obsidian-wikilink text-[12px] text-muted-foreground">
                [[{ui.contact}]]
              </a>
            </div>
          }
          footer={
            <>
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {ui.explorePages}
              </p>
              <PageNavPills
                items={navPages.map((page) => ({
                  href: page.id === 'projects' ? '#projects' : `#${page.id}`,
                  icon: page.icon,
                  label: page.label,
                }))}
              />
            </>
          }
        />
      </MotionSection>
    </PageShell>
  )
}

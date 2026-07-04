import { MailtoLink } from '@/components/ui/MailtoLink'
import { ProfilePhoto } from '@/components/ui/ProfilePhoto'
import { profile } from '@/data/portfolio'
import { portfolioStats } from '@/data/portfolio-meta'
import { type Lang, translations } from '@/i18n/translations'
import { notionPageBlocks } from '@/i18n/notion-blocks-content'
import { aboutTemplateContent } from '@/i18n/portfolio-template'
import {
  AboutCtaPanel,
  BioTagPills,
  BlockDivider,
  BlockHeading,
  BlockText,
  InfoFactGrid,
  PageHero,
  PageNavPills,
  PageShell,
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
} from '../notion-blocks'
import { getNotionPages } from '../nav'
import { PageCover } from '../PageCover'

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
  const blocks = notionPageBlocks[lang].about
  const navPages = getNotionPages(lang).filter((page) => page.id !== 'about')
  const bioTags = blocks.bioHighlight.split(' · ').map((tag) => tag.trim())

  const stats = portfolioStats.map((item) => ({
    value: item.value,
    label: ui[statLabelKey[item.id]],
  }))

  return (
    <PageShell cover={<PageCover variant="about" />}>
      <MotionSection>
        <PageHero
          circular
          name={profile.name}
          title={t.profile.title}
          tagline={template.aboutShort}
          photo={
            <ProfilePhoto className="h-24 w-24 overflow-hidden rounded-full sm:h-28 sm:w-28" priority />
          }
        />
        <BioTagPills items={bioTags} />
        <StatGrid items={stats} />
      </MotionSection>

      <MotionSection delay={0.06} className="mt-6">
        <BlockCalloutRich icon="📍" title={blocks.currentlyTitle} variant="info">
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
              icon: '📍',
              label: template.livesInLabel,
              value: template.profileFacts.livesIn,
              tone: 'rose',
            },
            {
              icon: '🎓',
              label: template.educationLabel,
              value: template.profileFacts.education,
              tone: 'yellow',
            },
            {
              icon: '🗣️',
              label: template.speaksLabel,
              value: template.profileFacts.speaks,
              tone: 'blue',
            },
            {
              icon: '❤️',
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
              <MailtoLink className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
                {ui.getInTouch} →
              </MailtoLink>
              <a
                href="#contact"
                className="text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-right"
              >
                {ui.contact} ↗
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

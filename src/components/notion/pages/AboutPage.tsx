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
} from '../notion-blocks'
import { getNotionPages } from '../nav'

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

  const facts = [
    {
      label: template.livesInLabel,
      value: template.profileFacts.livesIn,
      tone: 'rose' as const,
      icon: '🏠',
    },
    {
      label: template.educationLabel,
      value: template.profileFacts.education,
      tone: 'yellow' as const,
      icon: '🎓',
    },
    {
      label: template.speaksLabel,
      value: template.profileFacts.speaks,
      tone: 'blue' as const,
      icon: '💬',
    },
    {
      label: template.lovesLabel,
      value: template.profileFacts.loves,
      tone: 'sky' as const,
      icon: '❤️',
    },
  ]

  return (
    <PageShell>
      <MotionSection>
        <PageTitle icon="👋" description={template.aboutShort}>
          {profile.name}
        </PageTitle>

        <div className="mb-4 flex items-start gap-3.5">
          <ProfilePhoto
            className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[4px] ring-1 ring-[rgba(55,53,47,0.08)] sm:h-20 sm:w-20 dark:ring-[rgba(255,255,255,0.08)]"
            priority
          />
          <div className="min-w-0 pt-0.5">
            <p className="text-[16px] font-medium text-foreground">{t.profile.title}</p>
            <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {t.profile.tagline}
            </p>
          </div>
        </div>

        <BioTagPills items={bioTags} />
        <StatGrid items={stats} />
      </MotionSection>

      <MotionSection delay={0.04} className="mt-6">
        <BlockCalloutRich title={blocks.currentlyTitle} variant="info" icon="✨">
          {blocks.currentlyText}
        </BlockCalloutRich>
      </MotionSection>

      <MotionSection delay={0.06} className="mt-5">
        <SectionAnchorNav label={blocks.tocTitle} items={blocks.tocItems} />
      </MotionSection>

      <MotionSection delay={0.08} className="mt-6">
        <BlockQuote>{blocks.quote}</BlockQuote>
      </MotionSection>

      <MotionSection delay={0.1} className="mt-10" id="about-facts">
        <BlockHeading className="mt-0">{blocks.basicInfoTitle}</BlockHeading>
        <InfoFactGrid items={facts} />
      </MotionSection>

      <MotionSection delay={0.12} className="mt-10" id="about-skills">
        <BlockHeading className="mt-0">{template.skillsTitle}</BlockHeading>
        <p className="mb-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {template.skillsIntro}
        </p>
        <SkillFeatureGrid items={template.skills} />
      </MotionSection>

      <MotionSection delay={0.14} className="mt-10" id="about-approach">
        <BlockDivider />
        <BlockHeading>{blocks.approachTitle}</BlockHeading>
        <BlockTodoList items={blocks.approachTodos} />
        <div className="mt-2">
          <BlockToggleGroup
            items={blocks.workingStyle.map((item) => ({
              title: item.title,
              body: <BlockText className="text-[15px] text-muted-foreground">{item.body}</BlockText>,
            }))}
            defaultOpenIndex={0}
          />
        </div>
      </MotionSection>

      <MotionSection delay={0.16} className="mt-10">
        <AboutCtaPanel
          title={template.contactSection}
          body={template.contactShort}
          tagline={t.profile.tagline}
          action={
            <MailtoLink className="inline-flex items-center rounded-[4px] bg-primary px-3.5 py-2 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90">
              {ui.getInTouch}
            </MailtoLink>
          }
          footer={
            <>
              <p className="mb-2 text-[12px] font-medium text-muted-foreground">
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

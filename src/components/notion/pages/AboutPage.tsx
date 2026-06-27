import { MailtoLink } from '@/components/ui/MailtoLink'
import { ProfilePhoto } from '@/components/ui/ProfilePhoto'
import { profile } from '@/data/portfolio'
import { type Lang, translations } from '@/i18n/translations'
import { notionPageBlocks } from '@/i18n/notion-blocks-content'
import { aboutTemplateContent } from '@/i18n/portfolio-template'
import {
  BlockCallout,
  BlockDivider,
  BlockHeading,
  BlockText,
  GreetingTitle,
  InfoFactGrid,
  PageHero,
  PageNavPills,
  PageShell,
  SkillFeatureGrid,
  TwoColumnCards,
} from '../blocks'
import { MotionSection } from '../motion'
import {
  BlockCalloutRich,
  BlockDividerDots,
  BlockH3,
  BlockHighlight,
  BlockQuote,
  BlockTableOfContents,
  BlockTodoList,
  BlockToggleGroup,
} from '../notion-blocks'
import { getNotionPages } from '../nav'
import { PageCover } from '../PageCover'

export function AboutPage({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const ui = t.ui
  const template = aboutTemplateContent[lang]
  const blocks = notionPageBlocks[lang].about
  const navPages = getNotionPages(lang).filter((page) => page.id !== 'about')

  return (
    <PageShell cover={<PageCover variant="about" />}>
      <PageHero
        circular
        name={profile.name}
        title={t.profile.title}
        photo={
          <ProfilePhoto className="h-24 w-24 overflow-hidden rounded-full sm:h-28 sm:w-28" priority />
        }
      />

      <MotionSection delay={0.05}>
        <GreetingTitle greeting={template.greeting} role={t.profile.title} />
        <BlockHighlight tone="blue">{blocks.bioHighlight}</BlockHighlight>
      </MotionSection>

      <MotionSection delay={0.08}>
        <BlockTableOfContents title={blocks.tocTitle} items={blocks.tocItems} />
      </MotionSection>

      <MotionSection delay={0.1}>
        <TwoColumnCards
          left={{
            icon: '🎵',
            title: template.aboutSection,
            body: template.aboutShort,
          }}
          right={{
            icon: '✈️',
            title: template.contactSection,
            body: template.contactShort,
          }}
        />
      </MotionSection>

      <MotionSection delay={0.12} className="mt-6">
        <BlockQuote>{blocks.quote}</BlockQuote>
      </MotionSection>

      <MotionSection delay={0.15} className="mt-6" id="about-facts">
        <BlockH3>{template.livesInLabel}</BlockH3>
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

      <MotionSection delay={0.18} className="mt-6">
        <BlockCalloutRich icon="📍" title={blocks.currentlyTitle} variant="info">
          {blocks.currentlyText}
        </BlockCalloutRich>
      </MotionSection>

      <MotionSection delay={0.2} className="mt-8" id="about-skills">
        <BlockHeading className="mt-0">{template.skillsTitle}</BlockHeading>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{template.skillsIntro}</p>
        <SkillFeatureGrid items={template.skills} />
      </MotionSection>

      <MotionSection delay={0.24} className="mt-8" id="about-approach">
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

      <MotionSection delay={0.28} className="mt-8">
        <BlockDividerDots />
        <BlockHeading>{ui.explorePages}</BlockHeading>
        <PageNavPills
          items={navPages.map((page) => ({
            href: page.id === 'projects' ? '#projects' : `#${page.id}`,
            icon: page.icon,
            label: page.label,
          }))}
        />
      </MotionSection>

      <MotionSection delay={0.3} className="mt-6">
        <BlockCallout icon="✨" variant="idea">
          {t.profile.tagline}
        </BlockCallout>
      </MotionSection>

      <MotionSection delay={0.32} className="mt-4 text-center sm:text-left">
        <MailtoLink className="text-sm font-medium text-primary hover:underline">
          {ui.getInTouch} →
        </MailtoLink>
      </MotionSection>
    </PageShell>
  )
}

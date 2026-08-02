import { useState } from 'react'
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
  BlockHeading,
  BlockText,
  PageNavPills,
  PageShell,
  PageTitle,
  PropertyRow,
  PropertyTable,
  SectionTabs,
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
  const [activeTab, setActiveTab] = useState(blocks.tocItems[0]?.id ?? 'about-facts')

  const stats = portfolioStats.map((item) => ({
    value: item.value,
    label: ui[statLabelKey[item.id]],
  }))

  return (
    <PageShell cover={<PageCover variant="about" />}>
      <MotionSection>
        <PageTitle icon="👋" description={template.aboutShort}>
          {profile.name}
        </PageTitle>

        <div className="mb-5 flex items-start gap-5 sm:gap-6">
          <ProfilePhoto
            className="h-[120px] w-[120px] shrink-0 overflow-hidden rounded-[6px] bg-white ring-1 ring-[rgba(55,53,47,0.1)] sm:h-[148px] sm:w-[148px] dark:ring-[rgba(255,255,255,0.12)]"
            priority
          />
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-[17px] font-semibold tracking-[-0.01em] text-foreground sm:text-[18px]">
              {t.profile.title}
            </p>
            <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {t.profile.tagline}
            </p>
            <div className="mt-3.5">
              <BioTagPills items={bioTags} />
            </div>
          </div>
        </div>

        <StatGrid items={stats} />
      </MotionSection>

      <MotionSection delay={0.04} className="mt-5">
        <BlockCalloutRich title={blocks.currentlyTitle} variant="info" icon="✨">
          {blocks.currentlyText}
        </BlockCalloutRich>
      </MotionSection>

      <MotionSection delay={0.06} className="mt-5">
        <BlockQuote>{blocks.quote}</BlockQuote>
      </MotionSection>

      <MotionSection delay={0.08} className="mt-6">
        <SectionTabs
          label={blocks.tocTitle}
          items={blocks.tocItems}
          value={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-4">
          {activeTab === 'about-facts' ? (
            <div
              role="tabpanel"
              id="panel-about-facts"
              aria-labelledby="tab-about-facts"
            >
              <BlockHeading className="mt-0">{blocks.basicInfoTitle}</BlockHeading>
              <PropertyTable>
                <PropertyRow icon="🏠" label={template.livesInLabel}>
                  {template.profileFacts.livesIn}
                </PropertyRow>
                <PropertyRow icon="🎓" label={template.educationLabel}>
                  {template.profileFacts.education}
                </PropertyRow>
                <PropertyRow icon="💬" label={template.speaksLabel}>
                  {template.profileFacts.speaks}
                </PropertyRow>
                <PropertyRow icon="❤️" label={template.lovesLabel}>
                  {template.profileFacts.loves}
                </PropertyRow>
              </PropertyTable>
            </div>
          ) : null}

          {activeTab === 'about-skills' ? (
            <div
              role="tabpanel"
              id="panel-about-skills"
              aria-labelledby="tab-about-skills"
            >
              <BlockHeading className="mt-0">{template.skillsTitle}</BlockHeading>
              <p className="mb-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {template.skillsIntro}
              </p>
              <SkillFeatureGrid items={template.skills} />
            </div>
          ) : null}

          {activeTab === 'about-approach' ? (
            <div
              role="tabpanel"
              id="panel-about-approach"
              aria-labelledby="tab-about-approach"
            >
              <BlockHeading className="mt-0">{blocks.approachTitle}</BlockHeading>
              <p className="mb-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {blocks.approachIntro}
              </p>
              <BlockTodoList items={blocks.approachTodos} />
              <div className="mt-3">
                <BlockToggleGroup
                  items={blocks.workingStyle.map((item) => ({
                    title: item.title,
                    body: (
                      <BlockText className="text-[15px] text-muted-foreground">{item.body}</BlockText>
                    ),
                  }))}
                  defaultOpenIndex={0}
                />
              </div>
            </div>
          ) : null}
        </div>
      </MotionSection>

      <MotionSection delay={0.12} className="mt-10">
        <AboutCtaPanel
          title={template.contactSection}
          body={template.contactShort}
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

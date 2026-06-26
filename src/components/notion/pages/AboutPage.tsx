import { Badge } from '@/components/ui/badge'
import { ProfilePhoto } from '@/components/ui/ProfilePhoto'
import { profile } from '@/data/portfolio'
import { portfolioStats, serviceIcons } from '@/data/portfolio-meta'
import { type Lang, translations } from '@/i18n/translations'
import {
  BlockCallout,
  BlockHeading,
  BlockText,
  PageHero,
  PageNavPills,
  PageShell,
  PageTitle,
  PropertyRow,
  PropertyTable,
  ServiceGrid,
  StatGrid,
  TagList,
} from '../blocks'
import { MotionSection } from '../motion'
import { getNotionPages } from '../nav'
import { PageCover } from '../PageCover'

export function AboutPage({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const ui = t.ui
  const navPages = getNotionPages(lang).filter((page) => page.id !== 'about')

  const statLabels = {
    years: ui.statYears,
    roles: ui.statRoles,
    projects: ui.statProjects,
    stack: ui.statStack,
  } as const

  const stats = portfolioStats.map((stat) => ({
    value: stat.value,
    label: statLabels[stat.id],
  }))

  return (
    <PageShell cover={<PageCover variant="about" />}>
      <PageHero
        name={profile.name}
        title={t.profile.title}
        photo={
          <ProfilePhoto className="h-20 w-20 overflow-hidden rounded-lg sm:h-24 sm:w-24" priority />
        }
      />

      <MotionSection delay={0.05}>
        <PageTitle icon="👋">{ui.about}</PageTitle>
      </MotionSection>

      <MotionSection delay={0.1}>
        <StatGrid items={stats} />
      </MotionSection>

      <MotionSection delay={0.15} className="mt-6">
        <PropertyTable>
          <PropertyRow icon="💼" label={ui.notionRole}>
            {t.profile.title}
          </PropertyRow>
          <PropertyRow icon="📍" label={ui.locationLabel}>
            {t.profile.location}
          </PropertyRow>
          <PropertyRow
            icon={<span className="inline-block size-2 rounded-full bg-sky-500" />}
            label={ui.notionStatus}
          >
            <Badge
              variant="outline"
              className="border-sky-200 bg-sky-50 font-normal text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200"
            >
              {ui.notionOpenToWork}
            </Badge>
          </PropertyRow>
        </PropertyTable>
      </MotionSection>

      <MotionSection delay={0.2} className="mt-6">
        <BlockText>{t.profile.bio}</BlockText>
        <BlockCallout icon="✨" variant="idea">
          {t.profile.tagline}
        </BlockCallout>
      </MotionSection>

      <MotionSection delay={0.25} className="mt-6">
        <BlockHeading>{ui.whatIDo}</BlockHeading>
        <ServiceGrid
          items={t.services.map((service) => ({
            icon: serviceIcons[service.id] ?? '✦',
            label: service.label,
          }))}
        />
      </MotionSection>

      <MotionSection delay={0.3} className="mt-6">
        <BlockHeading>{ui.notionInterests}</BlockHeading>
        <TagList tags={profile.interests} />
      </MotionSection>

      <MotionSection delay={0.35} className="mt-8">
        <BlockHeading>{ui.explorePages}</BlockHeading>
        <PageNavPills
          items={navPages.map((page) => ({
            href: `#${page.id}`,
            icon: page.icon,
            label: page.label,
          }))}
        />
      </MotionSection>
    </PageShell>
  )
}

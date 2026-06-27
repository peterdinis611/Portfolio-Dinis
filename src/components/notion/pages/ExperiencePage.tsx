import { ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { type Lang, translations } from '@/i18n/translations'
import { notionPageBlocks } from '@/i18n/notion-blocks-content'
import { cn } from '@/lib/utils'
import {
  BlockBullets,
  BlockDivider,
  BlockHeading,
  BlockText,
  PageShell,
  PageTitle,
  TagList,
} from '../blocks'
import { MotionItem, MotionSection } from '../motion'
import {
  BlockCalloutRich,
  BlockNumberedList,
  BlockQuote,
  BlockToggleGroup,
} from '../notion-blocks'
import { PageCover } from '../PageCover'

type ExperienceJob = (typeof translations)[Lang]['experience'][number]

function ExperienceTimeline({
  jobs,
  expProjectsLabel,
  defaultOpenFirst,
  muted,
}: {
  jobs: ExperienceJob[]
  expProjectsLabel: string
  defaultOpenFirst: boolean
  muted?: boolean
}) {
  return (
    <div className={cn('relative space-y-3 pl-1', muted && 'opacity-90')}>
      <div className="absolute top-2 bottom-2 left-[11px] w-px bg-border" aria-hidden />
      {jobs.map((job, index) => (
        <MotionItem key={job.id} delay={0.08 + index * 0.04}>
          <Collapsible
            defaultOpen={defaultOpenFirst && index === 0}
            className={cn(
              'relative rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md',
              muted && 'border-border/70 bg-card/80',
            )}
          >
            <span
              className={cn(
                'absolute top-5 left-0 z-10 size-[9px] -translate-x-1/2 rounded-full border-2 border-background',
                muted ? 'bg-muted-foreground' : 'bg-primary',
              )}
              aria-hidden
            />
            <CollapsibleTrigger className="group/trigger flex w-full items-start gap-2 px-4 py-3.5 text-left">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/trigger:rotate-90" />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{job.role}</span>
                <span className="block text-sm text-muted-foreground">
                  {job.company} · {job.period}
                </span>
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t border-border px-4 py-3 pl-10">
              {'summary' in job && job.summary ? <BlockText>{job.summary}</BlockText> : null}
              <BlockBullets items={job.highlights} />
              {'tech' in job && job.tech ? (
                <div className="mt-3">
                  <TagList tags={job.tech.split(' · ').map((tag) => tag.trim())} />
                </div>
              ) : null}
              {'projects' in job && job.projects ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong className="text-foreground">{expProjectsLabel}:</strong> {job.projects}
                </p>
              ) : null}
            </CollapsibleContent>
          </Collapsible>
        </MotionItem>
      ))}
    </div>
  )
}

export function ExperiencePage({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const ui = t.ui
  const blocks = notionPageBlocks[lang].experience
  const production = t.experience.filter((job) => job.tier === 'production')
  const early = t.experience.filter((job) => job.tier === 'early')

  return (
    <PageShell cover={<PageCover variant="experience" />}>
      <MotionSection className="pt-2">
        <PageTitle icon="💼">{ui.experience}</PageTitle>
        <BlockText>{ui.expIntro}</BlockText>
      </MotionSection>

      <MotionSection delay={0.06}>
        <BlockQuote>{blocks.quote}</BlockQuote>
        <BlockToggleGroup
          items={blocks.highlightsToggle.map((item) => ({
            title: item.title,
            body: <BlockText>{item.body}</BlockText>,
          }))}
        />
      </MotionSection>

      <MotionSection delay={0.1} className="mt-6">
        <BlockHeading>{blocks.processTitle}</BlockHeading>
        <BlockNumberedList items={blocks.processSteps} />
      </MotionSection>

      <MotionSection delay={0.14} className="mt-6">
        <BlockCalloutRich icon="🎯" variant="success" title={ui.expProduction}>
          {ui.expIntro}
        </BlockCalloutRich>
        <ExperienceTimeline
          jobs={production}
          expProjectsLabel={ui.expProjects}
          defaultOpenFirst
        />
      </MotionSection>

      {early.length > 0 ? (
        <MotionSection delay={0.2} className="mt-8">
          <BlockDivider />
          <BlockHeading>{ui.expEarly}</BlockHeading>
          <ExperienceTimeline
            jobs={early}
            expProjectsLabel={ui.expProjects}
            defaultOpenFirst={false}
            muted
          />
        </MotionSection>
      ) : null}
    </PageShell>
  )
}

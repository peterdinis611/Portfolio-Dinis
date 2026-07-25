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
  SectionAnchorNav,
  TagList,
} from '../blocks'
import { MotionItem, MotionSection } from '../motion'
import {
  BlockCalloutRich,
  BlockQuote,
  BlockToggleGroup,
} from '../notion-blocks'

type ExperienceJob = (typeof translations)[Lang]['experience'][number]

const timelineAccents = [
  { dot: 'bg-[#2383e2]', surface: 'bg-[rgba(35,131,226,0.08)]' },
  { dot: 'bg-[#0f7b6c]', surface: 'bg-[rgba(15,123,108,0.08)]' },
  { dot: 'bg-[#6940a5]', surface: 'bg-[rgba(105,64,165,0.08)]' },
  { dot: 'bg-[#e9a800]', surface: 'bg-[rgba(233,168,0,0.1)]' },
]

function ProcessStepGrid({ items }: { items: readonly string[] }) {
  return (
    <ol className="my-2 space-y-1">
      {items.map((item, index) => {
        const [title, ...rest] = item.split(' — ')
        const body = rest.join(' — ')

        return (
          <li
            key={item}
            className="flex gap-3 rounded-[4px] px-1 py-2 transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)]"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[3px] bg-[rgba(55,53,47,0.08)] text-[12px] font-semibold text-muted-foreground dark:bg-[rgba(255,255,255,0.08)]">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-medium text-foreground">{title}</p>
              {body ? (
                <p className="mt-0.5 text-[14px] leading-relaxed text-muted-foreground">{body}</p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

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
    <div className={cn('relative mt-3 space-y-2 pl-1', muted && 'opacity-90')}>
      <div
        className="absolute top-3 bottom-3 left-[11px] w-px bg-[rgba(55,53,47,0.12)] dark:bg-[rgba(255,255,255,0.12)]"
        aria-hidden
      />
      {jobs.map((job, index) => {
        const accent = timelineAccents[index % timelineAccents.length]

        return (
          <MotionItem key={job.id} delay={0.08 + index * 0.04}>
            <Collapsible
              defaultOpen={defaultOpenFirst && index === 0}
              className={cn(
                'relative rounded-[4px]',
                accent.surface,
                muted && 'bg-[rgba(135,131,120,0.08)]',
              )}
            >
              <span
                className={cn(
                  'absolute top-5 left-0 z-10 size-2.5 -translate-x-1/2 rounded-full border-2 border-background',
                  muted ? 'bg-muted-foreground' : accent.dot,
                )}
                aria-hidden
              />
              <CollapsibleTrigger className="group/trigger flex w-full items-start gap-2 px-3.5 py-3 text-left">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/trigger:rotate-90" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-foreground">{job.role}</span>
                  <span className="mt-0.5 block text-[13px] text-muted-foreground">
                    {job.company} · {job.period}
                  </span>
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t border-[rgba(55,53,47,0.06)] px-3.5 py-3 pl-10 dark:border-[rgba(255,255,255,0.06)]">
                {'summary' in job && job.summary ? (
                  <BlockText className="mb-2 text-[15px]">{job.summary}</BlockText>
                ) : null}
                <BlockBullets items={job.highlights} />
                {'tech' in job && job.tech ? (
                  <div className="mt-3">
                    <TagList tags={job.tech.split(' · ').map((tag) => tag.trim())} />
                  </div>
                ) : null}
                {'projects' in job && job.projects ? (
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    <strong className="font-medium text-foreground">{expProjectsLabel}:</strong>{' '}
                    {job.projects}
                  </p>
                ) : null}
              </CollapsibleContent>
            </Collapsible>
          </MotionItem>
        )
      })}
    </div>
  )
}

export function ExperiencePage({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const ui = t.ui
  const blocks = notionPageBlocks[lang].experience
  const production = t.experience.filter((job) => job.tier === 'production')
  const early = t.experience.filter((job) => job.tier === 'early')

  const tocItems = [
    { id: 'exp-process', label: blocks.processTitle },
    { id: 'exp-production', label: ui.expProduction },
    ...(early.length > 0 ? [{ id: 'exp-early', label: ui.expEarly }] : []),
  ]

  return (
    <PageShell>
      <MotionSection>
        <PageTitle icon="💼" description={ui.expIntro}>
          {ui.experience}
        </PageTitle>
      </MotionSection>

      <MotionSection delay={0.04}>
        <BlockQuote>{blocks.quote}</BlockQuote>
      </MotionSection>

      <MotionSection delay={0.06} className="mt-5">
        <SectionAnchorNav label={blocks.tocTitle} items={tocItems} />
      </MotionSection>

      <MotionSection delay={0.08} className="mt-5">
        <BlockToggleGroup
          items={blocks.highlightsToggle.map((item) => ({
            title: item.title,
            body: <BlockText className="text-[15px] text-muted-foreground">{item.body}</BlockText>,
          }))}
        />
      </MotionSection>

      <MotionSection delay={0.1} className="mt-8" id="exp-process">
        <BlockHeading className="mt-0">{blocks.processTitle}</BlockHeading>
        <ProcessStepGrid items={blocks.processSteps} />
      </MotionSection>

      <MotionSection delay={0.14} className="mt-8" id="exp-production">
        <BlockCalloutRich variant="success" title={ui.expProduction} icon="🚀">
          {ui.expIntro}
        </BlockCalloutRich>
        <ExperienceTimeline
          jobs={production}
          expProjectsLabel={ui.expProjects}
          defaultOpenFirst
        />
      </MotionSection>

      {early.length > 0 ? (
        <MotionSection delay={0.2} className="mt-10" id="exp-early">
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

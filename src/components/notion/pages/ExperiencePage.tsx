import { ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { type Lang, translations } from '@/i18n/translations'
import { notionPageBlocks } from '@/i18n/notion-blocks-content'
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
import { MotionSection } from '../motion'
import { BlockQuote, BlockToggleGroup } from '../notion-blocks'
import { PageCover } from '../PageCover'

type ExperienceJob = (typeof translations)[Lang]['experience'][number]

function ProcessStepList({ items }: { items: readonly string[] }) {
  return (
    <ol className="mt-1 space-y-1">
      {items.map((item, index) => {
        const [title, ...rest] = item.split(' — ')
        const body = rest.join(' — ')

        return (
          <li
            key={item}
            className="notion-block flex items-start gap-3 rounded-[6px] px-1 py-2.5 transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)]"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-[14px] font-medium text-muted-foreground">
              {index + 1}.
            </span>
            <div className="min-w-0 pt-px">
              <p className="text-[16px] font-medium leading-[1.45] text-foreground">{title}</p>
              {body ? (
                <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">{body}</p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function ExperienceToggleList({
  jobs,
  expProjectsLabel,
  defaultOpenFirst,
}: {
  jobs: ExperienceJob[]
  expProjectsLabel: string
  defaultOpenFirst: boolean
}) {
  return (
    <div className="mt-1 space-y-1">
      {jobs.map((job, index) => (
        <Collapsible
          key={job.id}
          defaultOpen={defaultOpenFirst && index === 0}
          className="notion-block"
        >
          <CollapsibleTrigger className="group flex w-full items-start gap-1.5 rounded-[6px] px-1 py-2 text-left transition-colors hover:bg-[rgba(55,53,47,0.06)] dark:hover:bg-[rgba(255,255,255,0.055)]">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[3px] text-muted-foreground">
              <ChevronRight className="h-3.5 w-3.5 transition-transform duration-150 group-data-[state=open]:rotate-90" />
            </span>
            <span className="min-w-0 flex-1 py-px">
              <span className="block text-[16px] font-medium leading-[1.4] text-foreground">
                {job.role}
              </span>
              <span className="mt-1 block text-[13px] leading-snug text-muted-foreground">
                {job.company} · {job.period}
              </span>
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="pb-3 pl-8 pt-1">
            {'summary' in job && job.summary ? (
              <BlockText className="mb-3 text-[15px] text-foreground/90">{job.summary}</BlockText>
            ) : null}
            <BlockBullets items={job.highlights} />
            {'tech' in job && job.tech ? (
              <div className="mt-3.5">
                <TagList tags={job.tech.split(' · ').map((tag) => tag.trim())} />
              </div>
            ) : null}
            {'projects' in job && job.projects ? (
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">{expProjectsLabel}:</span>{' '}
                {job.projects}
              </p>
            ) : null}
          </CollapsibleContent>
        </Collapsible>
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

  const tocItems = [
    { id: 'exp-process', label: blocks.processTitle },
    { id: 'exp-production', label: ui.expProduction },
    ...(early.length > 0 ? [{ id: 'exp-early', label: ui.expEarly }] : []),
  ]

  return (
    <PageShell cover={<PageCover variant="experience" />}>
      <MotionSection>
        <PageTitle icon="💼" description={ui.expIntro}>
          {ui.experience}
        </PageTitle>
      </MotionSection>

      <MotionSection delay={0.04} className="mt-2">
        <BlockQuote>{blocks.quote}</BlockQuote>
      </MotionSection>

      <MotionSection delay={0.06} className="mt-8">
        <SectionAnchorNav label={blocks.tocTitle} items={tocItems} />
      </MotionSection>

      <MotionSection delay={0.08} className="mt-8">
        <BlockToggleGroup
          items={blocks.highlightsToggle.map((item) => ({
            title: item.title,
            body: <BlockText className="text-[15px] text-muted-foreground">{item.body}</BlockText>,
          }))}
        />
      </MotionSection>

      <MotionSection delay={0.1} className="mt-12 scroll-mt-24" id="exp-process">
        <BlockHeading className="mt-0">{blocks.processTitle}</BlockHeading>
        <ProcessStepList items={blocks.processSteps} />
      </MotionSection>

      <MotionSection delay={0.14} className="mt-12 scroll-mt-24" id="exp-production">
        <BlockHeading className="mt-0">{ui.expProduction}</BlockHeading>
        <ExperienceToggleList
          jobs={production}
          expProjectsLabel={ui.expProjects}
          defaultOpenFirst
        />
      </MotionSection>

      {early.length > 0 ? (
        <MotionSection delay={0.18} className="mt-12 scroll-mt-24" id="exp-early">
          <BlockDivider />
          <BlockHeading>{ui.expEarly}</BlockHeading>
          <ExperienceToggleList
            jobs={early}
            expProjectsLabel={ui.expProjects}
            defaultOpenFirst={false}
          />
        </MotionSection>
      ) : null}
    </PageShell>
  )
}

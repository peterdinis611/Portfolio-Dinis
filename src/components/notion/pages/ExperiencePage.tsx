import { ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { type Lang, translations } from '@/i18n/translations'
import { cn } from '@/lib/utils'
import { BlockBullets, BlockText, PageShell, PageTitle } from '../blocks'
import { MotionItem, MotionSection } from '../motion'
import { PageCover } from '../PageCover'

export function ExperiencePage({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const ui = t.ui

  return (
    <PageShell cover={<PageCover variant="experience" />}>
      <MotionSection className="pt-2">
        <PageTitle icon="💼">{ui.experience}</PageTitle>
        <BlockText>{ui.expIntro}</BlockText>
      </MotionSection>

      <div className="relative mt-6 space-y-3 pl-1">
        <div className="absolute top-2 bottom-2 left-[11px] w-px bg-border" aria-hidden />
        {t.experience.map((job, index) => (
          <MotionItem key={job.id} delay={0.08 + index * 0.04}>
            <Collapsible
              defaultOpen={index === 0}
              className={cn(
                'relative rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md',
              )}
            >
              <span
                className="absolute top-5 left-0 z-10 size-[9px] -translate-x-1/2 rounded-full border-2 border-background bg-primary"
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
                {'projects' in job && job.projects ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    <strong className="text-foreground">{ui.expProjects}:</strong> {job.projects}
                  </p>
                ) : null}
                {'tech' in job && job.tech ? (
                  <p className="mt-2 rounded-md bg-muted/50 px-2 py-1.5 text-xs font-medium">
                    {job.tech}
                  </p>
                ) : null}
              </CollapsibleContent>
            </Collapsible>
          </MotionItem>
        ))}
      </div>
    </PageShell>
  )
}

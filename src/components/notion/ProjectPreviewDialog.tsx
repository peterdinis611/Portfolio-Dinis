import { ArrowUpRight, ExternalLink, X } from 'lucide-react'
import { BrandIcon } from '@/components/icons/BrandIcon'
import { projects } from '@/data/portfolio'
import { type Lang } from '@/i18n/translations'
import { caseStudyContent, caseStudyUi } from '@/i18n/portfolio-template'
import { projectHref } from '@/lib/portfolio-route'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { TagList } from './blocks'
import { ProjectIcon } from './ProjectIcon'
import { ProjectShowcaseBlocks } from './ProjectShowcaseBlocks'

type ProjectPreviewDialogProps = {
  lang: Lang
  projectId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectPreviewDialog({
  lang,
  projectId,
  open,
  onOpenChange,
}: ProjectPreviewDialogProps) {
  const csUi = caseStudyUi[lang]
  const project = projectId ? projects.find((item) => item.id === projectId) : undefined
  const study = projectId ? caseStudyContent[lang][projectId] : undefined

  const tools = project?.tech.split(' · ').map((tag) => tag.trim()) ?? []
  const hasContent = Boolean(project && study)

  return (
    <Dialog open={open && hasContent} onOpenChange={onOpenChange}>
      {project && study ? (
        <DialogContent className="flex max-h-[min(86vh,44rem)] flex-col p-0">
          <div className="flex items-start justify-between gap-3 border-b border-[rgba(55,53,47,0.09)] px-5 py-4 dark:border-[rgba(255,255,255,0.09)]">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2.5">
                <ProjectIcon projectId={project.id} size="md" />
                <div className="min-w-0">
                  <DialogTitle className="truncate text-[18px] font-semibold tracking-[-0.01em]">
                    {project.name}
                  </DialogTitle>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    {study.type} · {study.date}
                  </p>
                </div>
              </div>
              <DialogDescription className="sr-only">{study.overview}</DialogDescription>
            </div>
            <DialogClose
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-muted-foreground transition-colors hover:bg-[rgba(55,53,47,0.08)] hover:text-foreground dark:hover:bg-[rgba(255,255,255,0.08)]"
              aria-label={csUi.closePreview}
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </DialogClose>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <p className="text-[14px] leading-relaxed text-foreground/90">{study.overview}</p>

            <div className="mt-5">
              <ProjectShowcaseBlocks
                projectId={project.id}
                lang={lang}
                projectName={project.name}
                compact
                labels={{
                  impactTitle: csUi.impactTitle,
                  mediaTitle: csUi.mediaTitle,
                  mediaTitleAnonymized: csUi.mediaTitleAnonymized,
                  anonymizedNote: csUi.anonymizedNote,
                  roleOutcomeTitle: csUi.roleOutcomeTitle,
                  architectureTitle: csUi.architectureTitle,
                  beforeAfterTitle: csUi.beforeAfterTitle,
                  beforeLabel: csUi.beforeLabel,
                  afterLabel: csUi.afterLabel,
                  demoTitle: csUi.demoTitle,
                  openLiveDemo: csUi.openLiveDemo,
                  viewSource: csUi.viewSource,
                  tryLive: csUi.tryLive,
                  hideLive: csUi.hideLive,
                }}
              />
            </div>

            <div className="mt-5">
              <p className="mb-2 text-[12px] font-medium text-muted-foreground">{csUi.toolsUsed}</p>
              <TagList tags={tools} />
            </div>

            {(project.githubUrl || project.liveUrl) && (
              <div className="mt-5 flex flex-wrap gap-2">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-[6px] border border-[rgba(55,53,47,0.12)] px-2.5 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-[rgba(55,53,47,0.05)] dark:border-[rgba(255,255,255,0.12)] dark:hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    <BrandIcon slug="github" className="h-3.5 w-3.5" label="GitHub" />
                    GitHub
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-[6px] border border-[rgba(55,53,47,0.12)] px-2.5 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-[rgba(55,53,47,0.05)] dark:border-[rgba(255,255,255,0.12)] dark:hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {csUi.liveDemo}
                  </a>
                ) : null}
              </div>
            )}
          </div>

          <div className="border-t border-[rgba(55,53,47,0.09)] px-5 py-3.5 dark:border-[rgba(255,255,255,0.09)]">
            <a
              href={projectHref(project.id)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-foreground px-3 py-2.5 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
              onClick={() => onOpenChange(false)}
            >
              {csUi.openCaseStudy}
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}

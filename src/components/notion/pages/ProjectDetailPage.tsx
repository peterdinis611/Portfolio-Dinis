import { ArrowLeft, ArrowRight } from 'lucide-react'
import { type Project, projects } from '@/data/portfolio'
import { projectMeta, projectPageUi } from '@/i18n/portfolio-template'
import { type Lang, translations } from '@/i18n/translations'
import { getAdjacentProjects, pageHref, projectHref } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import {
  BackLink,
  BlockDivider,
  BlockText,
  PageShell,
  PageTitle,
  PropertyRow,
  PropertyTable,
  TagList,
} from '../blocks'
import { MotionSection } from '../motion'
import { BlockBookmark } from '../notion-blocks'
import { PageCover } from '../PageCover'
import { PageCtaPanel } from '../PageCtaPanel'
import { ProjectIcon } from '../ProjectIcon'

function AdjacentProjectLink({
  project,
  label,
  direction,
}: {
  project: Project
  label: string
  direction: 'prev' | 'next'
}) {
  const isNext = direction === 'next'

  return (
    <a
      href={projectHref(project.id)}
      className={cn(
        'group notion-adjacent flex w-full min-w-0 items-center gap-3 rounded-[10px] border border-[rgba(55,53,47,0.1)] px-4 py-3.5 dark:border-[rgba(255,255,255,0.1)]',
        isNext && 'flex-row-reverse text-right',
      )}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(55,53,47,0.06)] text-muted-foreground transition-[background-color,color,transform] duration-250 group-hover:scale-105 group-hover:bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] group-hover:text-[var(--primary)] dark:bg-[rgba(255,255,255,0.06)]"
        aria-hidden
      >
        {isNext ? (
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        ) : (
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        )}
      </span>
      <span className="min-w-0 flex-1 overflow-hidden">
        <span className="block text-[12px] text-muted-foreground">{label}</span>
        <span
          className={cn(
            'mt-1 flex min-w-0 items-center gap-2 text-[15px] font-medium text-foreground',
            isNext && 'justify-end',
          )}
        >
          {!isNext ? <ProjectIcon projectId={project.id} size="xs" /> : null}
          <span className="truncate">{project.name}</span>
          {isNext ? <ProjectIcon projectId={project.id} size="xs" /> : null}
        </span>
      </span>
    </a>
  )
}

export function ProjectDetailPage({ lang, projectId }: { lang: Lang; projectId: string }) {
  const project = projects.find((item) => item.id === projectId)
  const meta = projectMeta[lang][projectId]
  const pageUi = projectPageUi[lang]
  const description = translations[lang].projects.find((p) => p.id === projectId)?.description

  if (!project || !meta) {
    return (
      <PageShell>
        <BackLink href={pageHref('projects')}>{pageUi.backToProjects}</BackLink>
        <BlockText>Project not found.</BlockText>
      </PageShell>
    )
  }

  const { prev, next } = getAdjacentProjects(projectId)
  const tools = project.tech.split(' · ').map((tag) => tag.trim())

  return (
    <PageShell cover={<PageCover projectId={projectId} />}>
      <MotionSection>
        <BackLink href={pageHref('projects')}>{pageUi.backToProjects}</BackLink>
        <PageTitle
          icon={<ProjectIcon projectId={projectId} size="lg" />}
          meta={
            <span className="inline-flex rounded-[3px] bg-[rgba(24,116,122,0.16)] px-1.5 py-0.5 text-[12px] font-medium text-[#18747a] dark:text-[#7ec8cf]">
              {meta.type}
            </span>
          }
        >
          {project.name}
        </PageTitle>
      </MotionSection>

      <MotionSection delay={0.05}>
        <PropertyTable>
          <PropertyRow label={pageUi.projectType}>{meta.type}</PropertyRow>
          {meta.date ? <PropertyRow label={pageUi.date}>{meta.date}</PropertyRow> : null}
          <PropertyRow label={pageUi.toolsUsed}>
            <TagList tags={tools} />
          </PropertyRow>
        </PropertyTable>
      </MotionSection>

      {description ? (
        <MotionSection delay={0.07}>
          <BlockText>{description}</BlockText>
        </MotionSection>
      ) : null}

      {(project.githubUrl || project.liveUrl) && (
        <MotionSection delay={0.09} className="mt-4">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap">
            {project.liveUrl ? (
              <div className="min-w-0 flex-1">
                <BlockBookmark
                  href={project.liveUrl}
                  title={pageUi.liveDemo}
                  description={project.name}
                  external
                />
              </div>
            ) : null}
            {project.githubUrl ? (
              <div className="min-w-0 flex-1">
                <BlockBookmark
                  href={project.githubUrl}
                  title={pageUi.sourceCode}
                  description={project.name}
                  external
                />
              </div>
            ) : null}
          </div>
        </MotionSection>
      )}

      {(prev || next) && (
        <MotionSection delay={0.12} className="mt-10">
          <BlockDivider />
          <nav
            className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
            aria-label={pageUi.nextProject}
          >
            {prev ? (
              <AdjacentProjectLink project={prev} label={pageUi.previousProject} direction="prev" />
            ) : (
              <span className="hidden sm:block" aria-hidden />
            )}
            {next ? (
              <AdjacentProjectLink project={next} label={pageUi.nextProject} direction="next" />
            ) : null}
          </nav>
        </MotionSection>
      )}

      <MotionSection delay={0.14} className="mt-10">
        <PageCtaPanel lang={lang} />
      </MotionSection>
    </PageShell>
  )
}

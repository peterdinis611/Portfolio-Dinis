import { useState } from 'react'
import { getProjectsForList, type Project, type ProjectListId, projects } from '@/data/portfolio'
import { notionPageBlocks } from '@/i18n/notion-blocks-content'
import { projectMeta, projectPageUi } from '@/i18n/portfolio-template'
import { type Lang, translations } from '@/i18n/translations'
import { projectHref } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import { NotionDatabase, PageShell, PageTitle } from '../blocks'
import { MotionSection } from '../motion'
import { getProjectListLabel } from '../nav'
import { BlockGallery } from '../notion-blocks'
import { PageCover } from '../PageCover'
import { PageCtaPanel } from '../PageCtaPanel'
import { ProjectIcon } from '../ProjectIcon'

type ViewMode = 'gallery' | 'table'

type ProjectsPageProps = {
  lang: Lang
  projectList?: ProjectListId
}

function buildRows(lang: Lang, items: Project[]) {
  return items.map((project) => {
    const meta = projectMeta[lang][project.id]
    return {
      id: project.id,
      href: projectHref(project.id),
      icon: <ProjectIcon projectId={project.id} size="sm" />,
      cells: [project.name, meta?.type ?? '', project.tech] as [string, string, string],
    }
  })
}

function buildGalleryItems(lang: Lang, items: Project[]) {
  const descriptions = Object.fromEntries(
    translations[lang].projects.map((p) => [p.id, p.description]),
  )

  return items.map((project) => {
    const meta = projectMeta[lang][project.id]
    return {
      id: project.id,
      href: projectHref(project.id),
      icon: <ProjectIcon projectId={project.id} size="md" />,
      title: project.name,
      subtitle: descriptions[project.id] ?? '',
      tags: [
        ...(meta?.type ? [meta.type] : []),
        ...project.tech
          .split(' · ')
          .slice(0, 3)
          .map((tag) => tag.trim()),
      ],
    }
  })
}

export function ProjectsPage({ lang, projectList }: ProjectsPageProps) {
  const ui = translations[lang].ui
  const pageUi = projectPageUi[lang]
  const blocks = notionPageBlocks[lang].projects
  const [view, setView] = useState<ViewMode>('gallery')

  const items = projectList ? getProjectsForList(projectList) : projects
  const pageTitle = projectList ? getProjectListLabel(lang, projectList) : ui.projects
  const pageIntro = projectList ? ui.myProjectsIntro : ui.projectsIntro

  return (
    <PageShell cover={<PageCover variant="projects" />}>
      <MotionSection>
        <PageTitle icon="🚀" description={pageIntro}>
          {pageTitle}
        </PageTitle>
        <fieldset className="inline-flex rounded-[6px] border-0 bg-[rgba(55,53,47,0.06)] p-0.5 text-[13px] dark:bg-[rgba(255,255,255,0.06)]">
          <legend className="sr-only">{blocks.galleryTitle}</legend>
          {(['gallery', 'table'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              className={cn(
                'rounded-[4px] px-3 py-1 font-medium transition-colors',
                view === mode
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {mode === 'gallery' ? blocks.galleryTitle : blocks.databaseTitle}
            </button>
          ))}
        </fieldset>
      </MotionSection>

      <MotionSection delay={0.08} className="mt-6">
        {view === 'gallery' ? (
          <BlockGallery items={buildGalleryItems(lang, items)} />
        ) : (
          <NotionDatabase
            columns={[pageUi.dbName, pageUi.dbType, pageUi.dbStack]}
            rows={buildRows(lang, items)}
          />
        )}
      </MotionSection>

      <MotionSection delay={0.12} className="mt-10">
        <PageCtaPanel lang={lang} />
      </MotionSection>
    </PageShell>
  )
}

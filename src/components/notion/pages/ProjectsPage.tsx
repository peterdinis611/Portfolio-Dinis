import { useState } from 'react'
import {
  getProjectsForList,
  projects,
  type Project,
  type ProjectListId,
} from '@/data/portfolio'
import { type Lang, translations } from '@/i18n/translations'
import { notionPageBlocks } from '@/i18n/notion-blocks-content'
import { caseStudyContent, caseStudyUi } from '@/i18n/portfolio-template'
import { cn } from '@/lib/utils'
import { NotionDatabase, PageShell, PageTitle } from '../blocks'
import { MotionSection } from '../motion'
import { BlockGallery } from '../notion-blocks'
import { getProjectListLabel } from '../nav'
import { PageCover } from '../PageCover'
import { ProjectIcon } from '../ProjectIcon'

type ViewMode = 'gallery' | 'table'

type ProjectsPageProps = {
  lang: Lang
  projectList?: ProjectListId
}

function buildRows(lang: Lang, items: Project[]) {
  return items.map((project) => {
    const study = caseStudyContent[lang][project.id]
    return {
      id: project.id,
      href: `#projects/${project.id}`,
      icon: <ProjectIcon projectId={project.id} size="sm" />,
      cells: [project.name, study.type, project.tech] as [string, string, string],
    }
  })
}

function buildGalleryItems(lang: Lang, items: Project[]) {
  return items.map((project) => {
    const study = caseStudyContent[lang][project.id]
    return {
      id: project.id,
      href: `#projects/${project.id}`,
      icon: <ProjectIcon projectId={project.id} size="md" />,
      title: project.name,
      subtitle: study.overview,
      tags: [study.type, ...project.tech.split(' · ').slice(0, 3).map((tag) => tag.trim())],
    }
  })
}

export function ProjectsPage({ lang, projectList }: ProjectsPageProps) {
  const ui = translations[lang].ui
  const csUi = caseStudyUi[lang]
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
        <div
          className="inline-flex rounded-[6px] bg-[rgba(55,53,47,0.06)] p-0.5 text-[13px] dark:bg-[rgba(255,255,255,0.06)]"
          role="group"
          aria-label={blocks.galleryTitle}
        >
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
        </div>
      </MotionSection>

      <MotionSection delay={0.08} className="mt-6">
        {view === 'gallery' ? (
          <BlockGallery items={buildGalleryItems(lang, items)} />
        ) : (
          <NotionDatabase
            columns={[csUi.dbName, csUi.dbType, csUi.dbStack]}
            rows={buildRows(lang, items)}
          />
        )}
      </MotionSection>
    </PageShell>
  )
}

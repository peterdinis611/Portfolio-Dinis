import { useState } from 'react'
import {
  getProjectsForList,
  type Project,
  type ProjectListId,
} from '@/data/portfolio'
import { type Lang, translations } from '@/i18n/translations'
import { notionPageBlocks } from '@/i18n/notion-blocks-content'
import { caseStudyContent, caseStudyUi } from '@/i18n/portfolio-template'
import { cn } from '@/lib/utils'
import { NotionDatabase, PageShell, PageTitle } from '../blocks'
import { MotionSection } from '../motion'
import { BlockGallery, BlockH3, BlockHighlight } from '../notion-blocks'
import { getProjectListLabel } from '../nav'
import { PageCover } from '../PageCover'
import { ProjectIcon } from '../ProjectIcon'
import { ProjectPreviewDialog } from '../ProjectPreviewDialog'

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
      subtitle: study.type,
      tags: project.tech.split(' · ').map((tag) => tag.trim()),
    }
  })
}

function ProjectCollection({
  lang,
  title,
  items,
  view,
  csUi,
  onProjectSelect,
  delay = 0,
}: {
  lang: Lang
  title: string
  items: Project[]
  view: ViewMode
  csUi: (typeof caseStudyUi)[Lang]
  onProjectSelect: (id: string) => void
  delay?: number
}) {
  if (items.length === 0) return null

  const rows = buildRows(lang, items)
  const galleryItems = buildGalleryItems(lang, items)

  return (
    <MotionSection delay={delay} className="mt-6 first:mt-0">
      <BlockH3>{title}</BlockH3>
      {view === 'gallery' ? (
        <BlockGallery items={galleryItems} onItemSelect={onProjectSelect} />
      ) : (
        <NotionDatabase
          columns={[csUi.dbName, csUi.dbType, csUi.dbStack]}
          rows={rows}
          onRowSelect={onProjectSelect}
        />
      )}
    </MotionSection>
  )
}

export function ProjectsPage({ lang, projectList }: ProjectsPageProps) {
  const ui = translations[lang].ui
  const csUi = caseStudyUi[lang]
  const blocks = notionPageBlocks[lang].projects
  const [view, setView] = useState<ViewMode>('gallery')
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const openPreview = (id: string) => {
    setPreviewId(id)
    setPreviewOpen(true)
  }

  const companyItems = getProjectsForList('companies-projects')
  const personalItems = getProjectsForList('my-projects')
  const pageTitle = projectList ? getProjectListLabel(lang, projectList) : ui.projects
  const pageIcon = projectList === 'companies-projects' ? '💼' : projectList === 'my-projects' ? '🛠️' : '🚀'
  const pageIntro = projectList
    ? projectList === 'companies-projects'
      ? ui.companiesProjectsIntro
      : ui.myProjectsIntro
    : ui.projectsIntro

  return (
    <PageShell cover={<PageCover variant="projects" />}>
      <MotionSection>
        <PageTitle icon={pageIcon} description={pageIntro}>
          {pageTitle}
        </PageTitle>
        <p className="mt-2">
          <BlockHighlight tone="gray">{blocks.viewNote}</BlockHighlight>
        </p>
      </MotionSection>

      <MotionSection delay={0.08} className="mt-4">
        <div className="inline-flex rounded-[6px] bg-[rgba(55,53,47,0.06)] p-0.5 text-[13px] dark:bg-[rgba(255,255,255,0.06)]">
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

      <MotionSection delay={0.12} className="mt-5">
        {projectList ? (
          <ProjectCollection
            lang={lang}
            title={blocks.databaseTitle}
            items={getProjectsForList(projectList)}
            view={view}
            csUi={csUi}
            onProjectSelect={openPreview}
          />
        ) : (
          <>
            <ProjectCollection
              lang={lang}
              title={ui.companiesProjects}
              items={companyItems}
              view={view}
              csUi={csUi}
              onProjectSelect={openPreview}
              delay={0}
            />
            <ProjectCollection
              lang={lang}
              title={ui.myProjects}
              items={personalItems}
              view={view}
              csUi={csUi}
              onProjectSelect={openPreview}
              delay={0.06}
            />
          </>
        )}
      </MotionSection>

      <ProjectPreviewDialog
        lang={lang}
        projectId={previewId}
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open)
          if (!open) setPreviewId(null)
        }}
      />
    </PageShell>
  )
}

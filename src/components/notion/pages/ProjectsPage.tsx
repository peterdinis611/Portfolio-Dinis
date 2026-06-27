import { useState } from 'react'
import { projects } from '@/data/portfolio'
import { projectMeta } from '@/data/portfolio-meta'
import { type Lang, translations } from '@/i18n/translations'
import { notionPageBlocks } from '@/i18n/notion-blocks-content'
import { caseStudyContent, caseStudyUi } from '@/i18n/portfolio-template'
import { cn } from '@/lib/utils'
import { BlockText, NotionDatabase, PageShell, PageTitle } from '../blocks'
import { MotionSection } from '../motion'
import { BlockGallery, BlockH3, BlockHighlight } from '../notion-blocks'
import { PageCover } from '../PageCover'

type ViewMode = 'gallery' | 'table'

export function ProjectsPage({ lang }: { lang: Lang }) {
  const ui = translations[lang].ui
  const csUi = caseStudyUi[lang]
  const blocks = notionPageBlocks[lang].projects
  const [view, setView] = useState<ViewMode>('gallery')

  const rows = projects.map((project) => {
    const meta = projectMeta[project.id] ?? { icon: '📄' }
    const study = caseStudyContent[lang][project.id]
    return {
      id: project.id,
      href: `#projects/${project.id}`,
      icon: meta.icon,
      cells: [project.name, study.type, project.tech] as [string, string, string],
    }
  })

  const galleryItems = projects.map((project) => {
    const study = caseStudyContent[lang][project.id]
    const meta = projectMeta[project.id] ?? { icon: '📄' }
    return {
      id: project.id,
      href: `#projects/${project.id}`,
      icon: meta.icon,
      title: project.name,
      subtitle: study.type,
      tags: project.tech.split(' · ').map((tag) => tag.trim()),
    }
  })

  return (
    <PageShell cover={<PageCover variant="projects" />}>
      <MotionSection className="pt-2">
        <PageTitle icon="🚀">{ui.projects}</PageTitle>
        <BlockText>{ui.projectsIntro}</BlockText>
        <BlockHighlight tone="gray">{blocks.viewNote}</BlockHighlight>
      </MotionSection>

      <MotionSection delay={0.08} className="mt-4">
        <div className="inline-flex rounded-md border border-border bg-muted/40 p-0.5 text-xs">
          {(['gallery', 'table'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              className={cn(
                'rounded px-3 py-1.5 font-medium transition-colors',
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
        {view === 'gallery' ? (
          <BlockGallery items={galleryItems} />
        ) : (
          <>
            <BlockH3>{blocks.databaseTitle}</BlockH3>
            <NotionDatabase
              columns={[csUi.dbName, csUi.dbType, csUi.dbStack]}
              rows={rows}
            />
          </>
        )}
      </MotionSection>
    </PageShell>
  )
}

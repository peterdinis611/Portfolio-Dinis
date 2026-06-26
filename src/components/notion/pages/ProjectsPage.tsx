import { Badge } from '@/components/ui/badge'
import { projects } from '@/data/portfolio'
import { projectMeta } from '@/data/portfolio-meta'
import { type Lang, translations } from '@/i18n/translations'
import { BlockText, PageShell, PageTitle } from '../blocks'
import { MotionItem, MotionSection } from '../motion'
import { PageCover } from '../PageCover'

export function ProjectsPage({ lang }: { lang: Lang }) {
  const t = translations[lang]
  const ui = t.ui
  const items = projects.map((p) => {
    const loc = t.projects.find((x) => x.id === p.id)!
    const meta = projectMeta[p.id] ?? { icon: '📄' }
    return { ...p, description: loc.description, ...meta }
  })

  return (
    <PageShell cover={<PageCover variant="projects" />}>
      <MotionSection className="pt-2">
        <PageTitle icon="🚀">{ui.projects}</PageTitle>
        <BlockText>{ui.projectsIntro}</BlockText>
      </MotionSection>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((project, index) => {
          const tags = project.tech.split(' · ').map((tag) => tag.trim())
          return (
            <MotionItem key={project.id} delay={0.08 + index * 0.05}>
              <article className="group h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                <div className="flex items-center gap-3 border-b border-border/70 bg-muted/40 px-4 py-3">
                  <span className="text-2xl" aria-hidden>
                    {project.icon}
                  </span>
                  <h3 className="font-semibold leading-tight">{project.name}</h3>
                </div>
                <div className="space-y-3 p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[11px] font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </article>
            </MotionItem>
          )
        })}
      </div>
    </PageShell>
  )
}

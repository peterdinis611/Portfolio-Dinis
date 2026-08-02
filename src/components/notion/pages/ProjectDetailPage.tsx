import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PROJECT_CATEGORY_BY_LIST, projects, type Project } from '@/data/portfolio'
import { type Lang } from '@/i18n/translations'
import { notionPageBlocks } from '@/i18n/notion-blocks-content'
import { caseStudyContent, caseStudyUi } from '@/i18n/portfolio-template'
import { getAdjacentProjects, projectHref, projectListHref } from '@/lib/portfolio-route'
import { cn } from '@/lib/utils'
import {
  BackLink,
  BlockBullets,
  BlockDivider,
  BlockText,
  CaseStudySection,
  PageShell,
  PageTitle,
  PropertyRow,
  PropertyTable,
  TagList,
} from '../blocks'
import { MotionSection } from '../motion'
import {
  BlockCalloutRich,
  BlockBookmark,
  BlockCode,
  BlockQuote,
  BlockTableOfContents,
  BlockToggle,
} from '../notion-blocks'
import { PageCover } from '../PageCover'
import { ProjectIcon } from '../ProjectIcon'
import { ProjectShowcaseBlocks } from '../ProjectShowcaseBlocks'

function RelatedProjectCard({ project }: { project: Project }) {
  const techPreview = project.tech.split(' · ').slice(0, 3).join(' · ')

  return (
    <a
      href={projectHref(project.id)}
      className="group flex min-w-0 items-start gap-3 rounded-[8px] px-2.5 py-2.5 transition-colors hover:bg-[rgba(55,53,47,0.06)] dark:hover:bg-[rgba(255,255,255,0.055)]"
    >
      <ProjectIcon projectId={project.id} size="md" className="mt-0.5" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium text-foreground group-hover:text-[var(--link)]">
          {project.name}
        </span>
        <span className="mt-0.5 block truncate text-[12px] text-muted-foreground">{techPreview}</span>
      </span>
    </a>
  )
}

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
        'group flex w-full min-w-0 items-center gap-3 rounded-[10px] border border-[rgba(55,53,47,0.1)] px-4 py-3.5 transition-colors hover:border-[rgba(55,53,47,0.18)] hover:bg-[rgba(55,53,47,0.04)] dark:border-[rgba(255,255,255,0.1)] dark:hover:border-[rgba(255,255,255,0.16)] dark:hover:bg-[rgba(255,255,255,0.045)]',
        isNext && 'flex-row-reverse text-right',
      )}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(55,53,47,0.06)] text-muted-foreground transition-colors group-hover:bg-[rgba(55,53,47,0.1)] group-hover:text-foreground dark:bg-[rgba(255,255,255,0.06)] dark:group-hover:bg-[rgba(255,255,255,0.1)]"
        aria-hidden
      >
        {isNext ? <ArrowRight className="h-4 w-4" strokeWidth={2} /> : <ArrowLeft className="h-4 w-4" strokeWidth={2} />}
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

const codeSnippets: Record<string, string> = {
  udzs: `// Feature module + typed API layer
export async function getDashboard(userId: string) {
  return api.get<DashboardDto>(\`/udzs/dashboard/\${userId}\`)
}`,
  eforms: `// Form submission with validation
const onSubmit = handleSubmit(async (values) => {
  await api.post('/eforms/submit', values)
  queryClient.invalidateQueries({ queryKey: ['submissions'] })
})`,
  prolekare: `// Shared UI component
export function AssetUploader({ onUpload }: AssetUploaderProps) {
  return <Dropzone onDrop={(files) => onUpload(files[0])} />
}`,
  licenses: `// NestJS license endpoint
@Get(':id')
findOne(@Param('id') id: string, @Req() req: AuthRequest) {
  return this.licenseService.findForRole(id, req.user.role)
}`,
  'iba-rd': `// Fluent UI design token usage
<FluentProvider theme={teamsTheme}>
  <Button appearance="primary">{label}</Button>
</FluentProvider>`,
  'docu-nest': `// Notebook route with typed queries
export async function getNotebook(notebookId: string) {
  return db.query.notebooks.findFirst({
    where: eq(notebooks.id, notebookId),
  })
}`,
  'scribe-notes': `// TipTap editor with slash commands
const editor = useEditor({
  extensions: [StarterKit, SlashCommand, Table],
  onUpdate: ({ editor }) => saveDocument(editor.getJSON()),
})`,
  'boom-scope': `// Convex project mutation
export const createProject = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    return await ctx.db.insert('projects', { name, createdAt: Date.now() })
  },
})`,
  'pulse-apiclient': `// Rust HTTP engine via Tauri
#[tauri::command]
async fn send_request(req: HttpRequest) -> Result<HttpResponse, String> {
  client.execute(build_reqwest(&req)?).await.map_err(|e| e.to_string())
}`,
  'spst-kniznica': `// Atomic book order with row lock
await db.transaction(async (tx) => {
  const book = await tx.select().from(books).where(eq(books.id, id)).for('update')
  if (book.availableCopies < 1) throw new Error('Out of stock')
  await tx.update(books).set({ availableCopies: book.availableCopies - 1 })
})`,
}

export function ProjectDetailPage({ lang, projectId }: { lang: Lang; projectId: string }) {
  const project = projects.find((item) => item.id === projectId)
  const study = caseStudyContent[lang][projectId]
  const csUi = caseStudyUi[lang]
  const blocks = notionPageBlocks[lang].projectDetail

  if (!project || !study) {
    return (
      <PageShell>
        <BackLink href="#projects">{csUi.backToProjects}</BackLink>
        <BlockText>Project not found.</BlockText>
      </PageShell>
    )
  }

  const relatedProjects = projects.filter(
    (item) => item.id !== projectId && item.category === project.category,
  )
  const { prev, next } = getAdjacentProjects(projectId)
  const backHref = projectListHref(PROJECT_CATEGORY_BY_LIST[project.category])

  const tools = project.tech.split(' · ').map((tag) => tag.trim())
  const code = codeSnippets[projectId]

  const tocItems = [
    { id: 'cs-impact', label: csUi.impactTitle },
    { id: 'cs-overview', label: csUi.overview },
    { id: 'cs-problem', label: csUi.problem },
    { id: 'cs-solution', label: csUi.solution },
    { id: 'cs-features', label: csUi.mainFeatures },
  ]

  const showcaseLabels = {
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
  }

  return (
    <PageShell cover={<PageCover projectId={projectId} />}>
      <MotionSection>
        <BackLink href={backHref}>{csUi.backToProjects}</BackLink>
        <PageTitle
          icon={<ProjectIcon projectId={projectId} size="lg" />}
          meta={
            <span className="inline-flex rounded-[3px] bg-[rgba(105,64,165,0.16)] px-1.5 py-0.5 text-[12px] font-medium text-[#6940a5] dark:text-[#9a6dd7]">
              {study.type}
            </span>
          }
        >
          {project.name}
        </PageTitle>
      </MotionSection>

      <MotionSection delay={0.06}>
        <PropertyTable>
          <PropertyRow label={csUi.myRole}>
            <TagList tags={study.roles} />
          </PropertyRow>
          <PropertyRow label={csUi.date}>{study.date}</PropertyRow>
          <PropertyRow label={csUi.projectType}>
            <span className="inline-flex rounded-[4px] bg-muted px-2 py-0.5 text-xs font-medium uppercase tracking-wide">
              {study.type}
            </span>
          </PropertyRow>
          <PropertyRow label={csUi.toolsUsed}>
            <TagList tags={tools} />
          </PropertyRow>
        </PropertyTable>
      </MotionSection>

      <MotionSection delay={0.08}>
        <BlockTableOfContents title={blocks.tocTitle} items={tocItems} />
        <BlockQuote>{study.overview}</BlockQuote>
      </MotionSection>

      <MotionSection delay={0.1} id="cs-impact" className="scroll-mt-24">
        <ProjectShowcaseBlocks
          projectId={projectId}
          lang={lang}
          projectName={project.name}
          labels={showcaseLabels}
        />
      </MotionSection>

      {(project.githubUrl || project.liveUrl) && (
        <MotionSection delay={0.11}>
          <BlockText className="mb-2 font-semibold text-foreground">{csUi.linksTitle}</BlockText>
          {project.githubUrl ? (
            <BlockBookmark
              href={project.githubUrl}
              title={csUi.sourceCode}
              description={project.name}
              external
            />
          ) : null}
          {project.liveUrl ? (
            <BlockBookmark
              href={project.liveUrl}
              title={csUi.liveDemo}
              description={project.name}
              external
            />
          ) : null}
        </MotionSection>
      )}

      <MotionSection delay={0.12}>
        <CaseStudySection id="cs-overview" title={csUi.overview}>
          <BlockText>{study.overview}</BlockText>
        </CaseStudySection>

        <CaseStudySection id="cs-problem" title={csUi.problem}>
          <BlockText>{study.problem}</BlockText>
        </CaseStudySection>

        <CaseStudySection id="cs-solution" title={csUi.solution}>
          <BlockText>{study.solution}</BlockText>
          {code ? <BlockCode code={code} language="TypeScript" /> : null}
        </CaseStudySection>

        <CaseStudySection id="cs-features" title={csUi.mainFeatures}>
          <BlockBullets items={study.features} />
        </CaseStudySection>

        <BlockToggle title={blocks.techNotesTitle} defaultOpen={false}>
          <BlockText>{blocks.techNotesBody}</BlockText>
          <BlockCalloutRich variant="warning" title={csUi.toolsUsed}>
            <TagList tags={tools} />
          </BlockCalloutRich>
        </BlockToggle>
      </MotionSection>

      {(relatedProjects.length > 0 || prev || next) && (
        <MotionSection delay={0.16} className="mt-10">
          <BlockDivider />
          {relatedProjects.length > 0 ? (
            <div className="mb-8">
              <h2 className="mb-3 text-[15px] font-semibold text-foreground">{blocks.relatedTitle}</h2>
              <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                {relatedProjects.map((item) => (
                  <RelatedProjectCard key={item.id} project={item} />
                ))}
              </div>
            </div>
          ) : null}

          {(prev || next) && (
            <nav
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              aria-label={csUi.nextProject}
            >
              {prev ? (
                <AdjacentProjectLink project={prev} label={csUi.previousProject} direction="prev" />
              ) : (
                <span className="hidden sm:block" aria-hidden />
              )}
              {next ? (
                <AdjacentProjectLink project={next} label={csUi.nextProject} direction="next" />
              ) : null}
            </nav>
          )}
        </MotionSection>
      )}
    </PageShell>
  )
}

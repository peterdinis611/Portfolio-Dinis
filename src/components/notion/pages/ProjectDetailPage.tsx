import { PROJECT_CATEGORY_BY_LIST, projects } from '@/data/portfolio'
import { projectMeta } from '@/data/portfolio-meta'
import { type Lang } from '@/i18n/translations'
import { notionPageBlocks } from '@/i18n/notion-blocks-content'
import { caseStudyContent, caseStudyUi } from '@/i18n/portfolio-template'
import { getAdjacentProjects, projectHref, projectListHref } from '@/lib/portfolio-route'
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
  BlockHighlight,
  BlockPageLink,
  BlockQuote,
  BlockTableOfContents,
  BlockToggle,
} from '../notion-blocks'
import { PageCover } from '../PageCover'

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
  const meta = projectMeta[projectId] ?? { icon: '📄' }

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
    { id: 'cs-overview', label: csUi.overview },
    { id: 'cs-problem', label: csUi.problem },
    { id: 'cs-solution', label: csUi.solution },
    { id: 'cs-features', label: csUi.mainFeatures },
  ]

  return (
    <PageShell cover={<PageCover projectId={projectId} />}>
      <MotionSection className="pt-2">
        <BackLink href={backHref}>{csUi.backToProjects}</BackLink>
        <PageTitle icon={meta.icon}>{project.name}</PageTitle>
        <BlockHighlight tone="pink">{study.type}</BlockHighlight>
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

      <MotionSection delay={0.1}>
        <BlockTableOfContents title={blocks.tocTitle} items={tocItems} />
        <BlockQuote>{study.overview}</BlockQuote>
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
          <BlockCalloutRich icon="⚙️" variant="warning" title={csUi.toolsUsed}>
            <TagList tags={tools} />
          </BlockCalloutRich>
        </BlockToggle>
      </MotionSection>

      <MotionSection delay={0.16} className="mt-8">
        <BlockDivider />
        <BlockText className="mb-2 font-semibold text-foreground">{blocks.relatedTitle}</BlockText>
        <div className="flex flex-col gap-0.5">
          {relatedProjects.map((item) => (
            <BlockPageLink
              key={item.id}
              href={projectHref(item.id)}
              icon={projectMeta[item.id]?.icon ?? '📄'}
              label={item.name}
            />
          ))}
        </div>
      </MotionSection>

      {(prev || next) && (
        <MotionSection delay={0.18} className="mt-2">
          <nav
            className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-stretch sm:justify-between"
            aria-label={blocks.relatedTitle}
          >
            {prev ? (
              <a
                href={projectHref(prev.id)}
                className="group flex flex-1 flex-col rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/50 sm:max-w-[48%]"
              >
                <span className="text-xs text-muted-foreground">{csUi.previousProject}</span>
                <span className="mt-1 text-sm font-medium group-hover:text-primary">
                  <span aria-hidden>{projectMeta[prev.id]?.icon ?? '📄'} </span>
                  {prev.name}
                </span>
              </a>
            ) : (
              <span className="hidden flex-1 sm:block" aria-hidden />
            )}
            {next ? (
              <a
                href={projectHref(next.id)}
                className="group flex flex-1 flex-col rounded-lg border border-border px-4 py-3 text-right transition-colors hover:bg-muted/50 sm:max-w-[48%]"
              >
                <span className="text-xs text-muted-foreground">{csUi.nextProject}</span>
                <span className="mt-1 text-sm font-medium group-hover:text-primary">
                  {next.name}
                  <span aria-hidden> {projectMeta[next.id]?.icon ?? '📄'}</span>
                </span>
              </a>
            ) : null}
          </nav>
        </MotionSection>
      )}
    </PageShell>
  )
}

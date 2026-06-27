import { projects } from '@/data/portfolio'
import { projectMeta } from '@/data/portfolio-meta'
import { type Lang } from '@/i18n/translations'
import { notionPageBlocks } from '@/i18n/notion-blocks-content'
import { caseStudyContent, caseStudyUi } from '@/i18n/portfolio-template'
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
  BlockCode,
  BlockHighlight,
  BlockPageLink,
  BlockQuote,
  BlockTableOfContents,
  BlockToggle,
} from '../notion-blocks'
import { getNotionPages } from '../nav'
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
}

export function ProjectDetailPage({ lang, projectId }: { lang: Lang; projectId: string }) {
  const project = projects.find((item) => item.id === projectId)
  const study = caseStudyContent[lang][projectId]
  const csUi = caseStudyUi[lang]
  const blocks = notionPageBlocks[lang].projectDetail
  const meta = projectMeta[projectId] ?? { icon: '📄' }
  const navPages = getNotionPages(lang).filter((page) => page.id !== 'projects')

  if (!project || !study) {
    return (
      <PageShell>
        <BackLink href="#projects">{csUi.backToProjects}</BackLink>
        <BlockText>Project not found.</BlockText>
      </PageShell>
    )
  }

  const tools = project.tech.split(' · ').map((tag) => tag.trim())
  const code = codeSnippets[projectId]

  const tocItems = [
    { id: 'cs-overview', label: csUi.overview },
    { id: 'cs-problem', label: csUi.problem },
    { id: 'cs-solution', label: csUi.solution },
    { id: 'cs-features', label: csUi.mainFeatures },
  ]

  return (
    <PageShell cover={<PageCover variant="projects" />}>
      <MotionSection className="pt-2">
        <BackLink href="#projects">{csUi.backToProjects}</BackLink>
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
          {navPages.map((page) => (
            <BlockPageLink
              key={page.id}
              href={`#${page.id}`}
              icon={page.icon}
              label={page.label}
            />
          ))}
        </div>
      </MotionSection>
    </PageShell>
  )
}

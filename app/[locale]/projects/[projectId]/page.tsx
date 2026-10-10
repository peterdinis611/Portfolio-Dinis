import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/JsonLd'
import { ProjectDetailPage } from '@/components/notion/pages/ProjectDetailPage'
import { ProjectsPage } from '@/components/notion/pages/ProjectsPage'
import { projects } from '@/data/portfolio'
import { resolveLocale } from '@/lib/i18n-params'
import { LOCALES } from '@/lib/locale'
import { isProjectId, isProjectListId } from '@/lib/portfolio-route'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

export function generateStaticParams() {
  const ids = [...projects.map((p) => p.id), 'my-projects']
  return LOCALES.flatMap((locale) => ids.map((projectId) => ({ locale, projectId })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; projectId: string }>
}) {
  const { locale: localeParam, projectId } = await params
  const locale = await resolveLocale(Promise.resolve({ locale: localeParam }))
  if (isProjectListId(projectId)) {
    return buildMetadata(locale, { page: 'projects', projectList: projectId })
  }
  if (isProjectId(projectId)) {
    return buildMetadata(locale, { page: 'projects', projectId })
  }
  return buildMetadata(locale, { page: 'not-found', attemptedPath: `projects/${projectId}` })
}

export default async function ProjectOrListRoute({
  params,
}: {
  params: Promise<{ locale: string; projectId: string }>
}) {
  const { locale: localeParam, projectId } = await params
  const locale = await resolveLocale(Promise.resolve({ locale: localeParam }))

  if (isProjectListId(projectId)) {
    return (
      <>
        <JsonLd locale={locale} route={{ page: 'projects', projectList: projectId }} />
        <ProjectsPage lang={locale} projectList={projectId} />
      </>
    )
  }

  if (isProjectId(projectId)) {
    return (
      <>
        <JsonLd locale={locale} route={{ page: 'projects', projectId }} />
        <ProjectDetailPage lang={locale} projectId={projectId} />
      </>
    )
  }

  notFound()
}

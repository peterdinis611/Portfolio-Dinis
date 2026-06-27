import { projects } from '@/data/portfolio'
import type { NotionPageId } from '@/components/notion/types'

export type PortfolioRoute = {
  page: NotionPageId
  projectId?: string
}

const PROJECT_IDS = new Set(projects.map((project) => project.id))

export function isProjectId(value: string): boolean {
  return PROJECT_IDS.has(value)
}

export function isNotionPageId(value: string): value is NotionPageId {
  return ['about', 'tech', 'experience', 'projects', 'contact'].includes(value)
}

export function parsePortfolioRoute(hash = window.location.hash): PortfolioRoute {
  const path = hash.replace(/^#\/?/, '')
  const [pagePart, projectId] = path.split('/')

  if (pagePart === 'projects' && projectId && isProjectId(projectId)) {
    return { page: 'projects', projectId }
  }

  return { page: isNotionPageId(pagePart) ? pagePart : 'about' }
}

export function portfolioRouteEquals(a: PortfolioRoute, b: PortfolioRoute): boolean {
  return a.page === b.page && a.projectId === b.projectId
}

export function setPortfolioHash(route: PortfolioRoute) {
  const next = route.projectId ? `#projects/${route.projectId}` : `#${route.page}`
  if (window.location.hash !== next) {
    window.history.replaceState(null, '', next)
  }
}

/** @deprecated Use parsePortfolioRoute().page */
export function pageFromHash(): NotionPageId {
  return parsePortfolioRoute().page
}

/** @deprecated Use setPortfolioHash */
export function setPageHash(page: NotionPageId) {
  setPortfolioHash({ page })
}

export function getProjectName(projectId: string): string | undefined {
  return projects.find((project) => project.id === projectId)?.name
}

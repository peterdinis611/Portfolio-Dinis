import { projects } from '@/data/portfolio'
import type { NotionPageId } from '@/components/notion/types'

export type PortfolioPageId = NotionPageId | 'not-found'

export type PortfolioRoute = {
  page: PortfolioPageId
  projectId?: string
  attemptedPath?: string
}

const PROJECT_IDS = new Set(projects.map((project) => project.id))

export function isProjectId(value: string): boolean {
  return PROJECT_IDS.has(value)
}

export function isNotionPageId(value: string): value is NotionPageId {
  return ['about', 'tech', 'experience', 'projects', 'contact'].includes(value)
}

function getRoutePath(location: Pick<Location, 'hash' | 'pathname'>): string {
  const hashPath = location.hash.replace(/^#\/?/, '').trim()
  if (hashPath) return hashPath

  const pathname = location.pathname.replace(/^\/+|\/+$/g, '')
  if (!pathname || pathname === 'index.html') return ''

  return pathname
}

function parseRoutePath(path: string): PortfolioRoute {
  if (!path) {
    return { page: 'about' }
  }

  const segments = path.split('/').filter(Boolean)
  const [pagePart, projectId, ...extra] = segments

  if (extra.length > 0) {
    return { page: 'not-found', attemptedPath: path }
  }

  if (pagePart === 'projects') {
    if (projectId) {
      if (isProjectId(projectId)) {
        return { page: 'projects', projectId }
      }
      return { page: 'not-found', attemptedPath: path }
    }
    return { page: 'projects' }
  }

  if (isNotionPageId(pagePart)) {
    return { page: pagePart }
  }

  return { page: 'not-found', attemptedPath: path }
}

export function parsePortfolioRoute(
  location: Pick<Location, 'hash' | 'pathname'> = window.location,
): PortfolioRoute {
  return parseRoutePath(getRoutePath(location))
}

export function portfolioRouteEquals(a: PortfolioRoute, b: PortfolioRoute): boolean {
  return (
    a.page === b.page &&
    a.projectId === b.projectId &&
    a.attemptedPath === b.attemptedPath
  )
}

export function setPortfolioHash(route: PortfolioRoute) {
  if (route.page === 'not-found') return

  const hash = route.projectId ? `#projects/${route.projectId}` : `#${route.page}`
  const next = `/${hash}`

  if (`${window.location.pathname}${window.location.hash}` !== next) {
    window.history.replaceState(null, '', next)
  }
}

/** @deprecated Use parsePortfolioRoute().page */
export function pageFromHash(): NotionPageId {
  const route = parsePortfolioRoute()
  return route.page === 'not-found' ? 'about' : route.page
}

/** @deprecated Use setPortfolioHash */
export function setPageHash(page: NotionPageId) {
  setPortfolioHash({ page })
}

export function getProjectName(projectId: string): string | undefined {
  return projects.find((project) => project.id === projectId)?.name
}

import {
  getProjectsForList,
  PROJECT_CATEGORY_BY_LIST,
  projects,
  type ProjectListId,
} from '@/data/portfolio'
import type { NotionPageId } from '@/components/notion/types'

export type { ProjectListId } from '@/data/portfolio'

export type PortfolioPageId = NotionPageId | 'not-found'

export type PortfolioRoute = {
  page: PortfolioPageId
  projectId?: string
  projectList?: ProjectListId
  attemptedPath?: string
}

const PROJECT_IDS = new Set(projects.map((project) => project.id))
const PROJECT_LIST_IDS = new Set<ProjectListId>(['companies-projects', 'my-projects'])

export function isProjectId(value: string): boolean {
  return PROJECT_IDS.has(value)
}

export function isProjectListId(value: string): value is ProjectListId {
  return PROJECT_LIST_IDS.has(value as ProjectListId)
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
  const [pagePart, secondSegment, ...extra] = segments

  if (extra.length > 0) {
    return { page: 'not-found', attemptedPath: path }
  }

  if (pagePart === 'projects') {
    if (secondSegment) {
      if (isProjectListId(secondSegment)) {
        return { page: 'projects', projectList: secondSegment }
      }
      if (isProjectId(secondSegment)) {
        return { page: 'projects', projectId: secondSegment }
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
    a.projectList === b.projectList &&
    a.attemptedPath === b.attemptedPath
  )
}

export function setPortfolioHash(route: PortfolioRoute) {
  if (route.page === 'not-found') return

  const hash = route.projectId
    ? `#projects/${route.projectId}`
    : route.projectList
      ? `#projects/${route.projectList}`
      : `#${route.page}`
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

export function projectHref(projectId: string): string {
  return `#projects/${projectId}`
}

export function projectListHref(listId: ProjectListId): string {
  return `#projects/${listId}`
}

export function getAdjacentProjects(projectId: string) {
  const project = projects.find((item) => item.id === projectId)
  if (!project) return { prev: undefined, next: undefined }

  const peers = getProjectsForList(PROJECT_CATEGORY_BY_LIST[project.category])
  const index = peers.findIndex((item) => item.id === projectId)
  if (index < 0) return { prev: undefined, next: undefined }

  return {
    prev: index > 0 ? peers[index - 1] : undefined,
    next: index < peers.length - 1 ? peers[index + 1] : undefined,
  }
}

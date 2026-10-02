import type { NotionPageId } from '@/components/notion/types'
import { getNote, isNoteId, notes } from '@/data/notes'
import {
  getProjectsForList,
  PROJECT_CATEGORY_BY_LIST,
  type ProjectListId,
  projects,
} from '@/data/portfolio'

export type { ProjectListId } from '@/data/portfolio'

export type PortfolioPageId = NotionPageId | 'not-found' | 'error'

export type PortfolioRoute = {
  page: PortfolioPageId
  projectId?: string
  projectList?: ProjectListId
  noteId?: string
  attemptedPath?: string
}

const PROJECT_IDS = new Set(projects.map((project) => project.id))
const PROJECT_LIST_IDS = new Set<ProjectListId>(['my-projects'])

export function isProjectId(value: string): boolean {
  return PROJECT_IDS.has(value)
}

export function isProjectListId(value: string): value is ProjectListId {
  return PROJECT_LIST_IDS.has(value as ProjectListId)
}

export function isNotionPageId(value: string): value is NotionPageId {
  return ['about', 'tech', 'experience', 'projects', 'notes', 'cv', 'contact'].includes(value)
}

/** Prefer pathname; fall back to hash for legacy URLs during migration. */
function getRoutePath(location: Pick<Location, 'hash' | 'pathname'>): string {
  const pathname = location.pathname.replace(/^\/+|\/+$/g, '')
  if (pathname && pathname !== 'index.html') return pathname

  const hashPath = location.hash.replace(/^#\/?/, '').trim()
  if (hashPath) return hashPath

  return ''
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

  if (pagePart === 'error') {
    return { page: 'error' }
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

  if (pagePart === 'notes') {
    if (secondSegment) {
      if (isNoteId(secondSegment)) {
        return { page: 'notes', noteId: secondSegment }
      }
      return { page: 'not-found', attemptedPath: path }
    }
    return { page: 'notes' }
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
    a.noteId === b.noteId &&
    a.attemptedPath === b.attemptedPath
  )
}

export function routeToPath(route: PortfolioRoute): string {
  if (route.page === 'not-found') return '/'
  if (route.projectId) return `/projects/${route.projectId}`
  if (route.projectList) return `/projects/${route.projectList}`
  if (route.noteId) return `/notes/${route.noteId}`
  if (route.page === 'about') return '/'
  return `/${route.page}`
}

export function setPortfolioPath(route: PortfolioRoute, mode: 'push' | 'replace' = 'push') {
  if (route.page === 'not-found') return

  const path = routeToPath(route)
  // Keep existing search params when already on this path (e.g. /notes?q=…).
  if (window.location.pathname === path) return

  if (mode === 'replace') {
    window.history.replaceState(null, '', path)
  } else {
    window.history.pushState(null, '', path)
  }
  window.dispatchEvent(new Event('portfolio:navigate'))
}

/** Migrate legacy `#about` / `#projects/foo` hashes to path URLs. */
export function migrateHashToPath() {
  const hashPath = window.location.hash.replace(/^#\/?/, '').trim()
  if (!hashPath) return

  const route = parseRoutePath(hashPath)
  if (route.page === 'not-found') {
    window.history.replaceState(null, '', `/${hashPath}`)
    return
  }

  setPortfolioPath(route, 'replace')
}

/** @deprecated Use parsePortfolioRoute().page */
export function pageFromHash(): NotionPageId {
  const route = parsePortfolioRoute()
  if (route.page === 'not-found' || route.page === 'error') return 'about'
  return route.page
}

/** @deprecated Use setPortfolioPath */
export function setPageHash(page: NotionPageId) {
  setPortfolioPath({ page })
}

/** @deprecated Use setPortfolioPath */
export function setPortfolioHash(route: PortfolioRoute) {
  setPortfolioPath(route)
}

export function getProjectName(projectId: string): string | undefined {
  return projects.find((project) => project.id === projectId)?.name
}

export function getNoteTitle(noteId: string, lang: 'sk' | 'en'): string | undefined {
  return getNote(noteId)?.title[lang]
}

export function pageHref(page: NotionPageId | 'error'): string {
  return page === 'about' ? '/' : `/${page}`
}

export function projectHref(projectId: string): string {
  return `/projects/${projectId}`
}

export function projectListHref(listId: ProjectListId): string {
  return `/projects/${listId}`
}

export function noteHref(noteId: string): string {
  return `/notes/${noteId}`
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

export function getAdjacentNotes(noteId: string) {
  const index = notes.findIndex((item) => item.id === noteId)
  if (index < 0) return { prev: undefined, next: undefined }

  return {
    prev: index > 0 ? notes[index - 1] : undefined,
    next: index < notes.length - 1 ? notes[index + 1] : undefined,
  }
}

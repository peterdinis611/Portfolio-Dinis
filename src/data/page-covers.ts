export type PageCoverImage = {
  src: string
  srcWebp?: string
  alt: string
  srcDark?: string
  srcDarkWebp?: string
  objectPosition?: string
  objectPositionDark?: string
}

export type PageCoverVariant = 'about' | 'tech' | 'experience' | 'projects' | 'contact'

/** Notion-style page covers — WebP primary, JPEG fallback (optimized ~1280w). */
export const pageCoverImages: Record<PageCoverVariant, PageCoverImage> = {
  about: {
    src: '/covers/about.jpg',
    srcWebp: '/covers/about.webp',
    // Keep the brighter workspace photo in dark mode — code.jpg disappears into the shell.
    srcDark: '/covers/about.jpg',
    srcDarkWebp: '/covers/about.webp',
    alt: 'Developer workspace with laptop showing code',
    objectPosition: 'center 40%',
    objectPositionDark: 'center 35%',
  },
  tech: {
    src: '/covers/experience.jpg',
    srcWebp: '/covers/experience.webp',
    alt: 'Developers collaborating at a laptop',
    objectPosition: 'center 42%',
  },
  experience: {
    src: '/covers/experience.jpg',
    srcWebp: '/covers/experience.webp',
    alt: 'Developers collaborating at a laptop',
  },
  projects: {
    src: '/covers/about.jpg',
    srcWebp: '/covers/about.webp',
    alt: 'Developer workspace',
    objectPosition: 'center 40%',
  },
  contact: {
    src: '/covers/contact.jpg',
    srcWebp: '/covers/contact.webp',
    alt: 'Developer workspace with laptop',
  },
}

/** Per-project cover crops — unique assets per project. */
export const projectCoverImages: Record<string, PageCoverImage> = {
  'docu-nest': {
    src: '/covers/docu-nest.jpg',
    srcWebp: '/covers/docu-nest.webp',
    alt: 'Notebook and notes — Docu-Nest',
    objectPosition: 'center 40%',
  },
  'scribe-notes': {
    src: '/covers/scribe-notes.jpg',
    srcWebp: '/covers/scribe-notes.webp',
    alt: 'Writing and typewriter — Scribe Notes',
    objectPosition: 'center 55%',
  },
  'boom-scope': {
    src: '/covers/boom-scope.jpg',
    srcWebp: '/covers/boom-scope.webp',
    alt: 'Design and canvas workspace — Boom Scope',
    objectPosition: 'center 35%',
  },
  'pulse-apiclient': {
    src: '/covers/pulse-apiclient.jpg',
    srcWebp: '/covers/pulse-apiclient.webp',
    alt: 'Code terminal and API — Pulse API Client',
    objectPosition: 'center 30%',
  },
  'spst-kniznica': {
    src: '/covers/spst-kniznica.jpg',
    srcWebp: '/covers/spst-kniznica.webp',
    alt: 'Library with books — SPST Knižnica',
    objectPosition: 'center 50%',
  },
}

export function getProjectCover(projectId: string): PageCoverImage | undefined {
  return projectCoverImages[projectId]
}

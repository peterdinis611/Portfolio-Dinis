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
    srcDark: '/covers/code.jpg',
    srcDarkWebp: '/covers/code.webp',
    alt: 'Developer workspace with laptop showing code',
    objectPosition: 'center 40%',
    objectPositionDark: 'left 42%',
  },
  tech: {
    src: '/covers/code.jpg',
    srcWebp: '/covers/code.webp',
    alt: 'Source code on a screen',
    objectPosition: 'left 42%',
  },
  experience: {
    src: '/covers/experience.jpg',
    srcWebp: '/covers/experience.webp',
    alt: 'Developers collaborating at a laptop',
  },
  projects: {
    src: '/covers/code.jpg',
    srcWebp: '/covers/code.webp',
    alt: 'Code editor on a monitor',
    objectPosition: 'left 42%',
  },
  contact: {
    src: '/covers/contact.jpg',
    srcWebp: '/covers/contact.webp',
    alt: 'Developer workspace with laptop',
  },
}

/** Per-project cover crops — shared optimized assets, distinct framing. */
export const projectCoverImages: Record<string, PageCoverImage> = {
  'docu-nest': {
    src: '/covers/code.jpg',
    srcWebp: '/covers/code.webp',
    alt: 'Code editor — Docu-Nest',
    objectPosition: 'right 35%',
  },
  'scribe-notes': {
    src: '/covers/about.jpg',
    srcWebp: '/covers/about.webp',
    srcDark: '/covers/code.jpg',
    srcDarkWebp: '/covers/code.webp',
    alt: 'Writing workspace — Scribe Notes',
    objectPosition: 'center 50%',
    objectPositionDark: 'center 40%',
  },
  'boom-scope': {
    src: '/covers/code.jpg',
    srcWebp: '/covers/code.webp',
    alt: 'Design workspace — Boom Scope',
    objectPosition: 'center 30%',
  },
  'pulse-apiclient': {
    src: '/covers/contact.jpg',
    srcWebp: '/covers/contact.webp',
    alt: 'Developer tools — Pulse API Client',
    objectPosition: 'left 50%',
  },
  'spst-kniznica': {
    src: '/covers/experience.jpg',
    srcWebp: '/covers/experience.webp',
    alt: 'Collaboration — SPST Knižnica',
    objectPosition: 'right 40%',
  },
}

export function getProjectCover(projectId: string): PageCoverImage | undefined {
  return projectCoverImages[projectId]
}

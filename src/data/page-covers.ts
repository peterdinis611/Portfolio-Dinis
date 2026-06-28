export type PageCoverImage = {
  src: string
  alt: string
  srcDark?: string
  objectPosition?: string
  objectPositionDark?: string
}

export type PageCoverVariant = 'about' | 'tech' | 'experience' | 'projects' | 'contact'

/** Notion-style page cover images (Unsplash, stored in /public/covers). */
export const pageCoverImages: Record<PageCoverVariant, PageCoverImage> = {
  about: {
    src: '/covers/about.jpg',
    srcDark: '/covers/about-dark.jpg',
    alt: 'Developer workspace with laptop showing code',
    objectPosition: 'center 40%',
    objectPositionDark: 'left 42%',
  },
  tech: {
    src: '/covers/tech.jpg',
    alt: 'Source code on a screen',
    objectPosition: 'left 42%',
  },
  experience: {
    src: '/covers/experience.jpg',
    alt: 'Developers collaborating at a laptop',
  },
  projects: {
    src: '/covers/projects.jpg',
    alt: 'Code editor on a monitor',
    objectPosition: 'left 42%',
  },
  contact: {
    src: '/covers/contact.jpg',
    alt: 'Developer workspace with laptop',
  },
}

/** Per-project cover crops — reuses gallery images with distinct framing. */
export const projectCoverImages: Record<string, PageCoverImage> = {
  udzs: {
    src: '/covers/tech.jpg',
    alt: 'Source code on a screen — ÚDZS Platform',
    objectPosition: 'left 42%',
  },
  eforms: {
    src: '/covers/projects.jpg',
    alt: 'Code editor — EForms',
    objectPosition: 'center 35%',
  },
  prolekare: {
    src: '/covers/experience.jpg',
    alt: 'Developers collaborating — prolekare.cz',
    objectPosition: 'center 30%',
  },
  licenses: {
    src: '/covers/contact.jpg',
    alt: 'Developer workspace — Enterprise License System',
    objectPosition: 'center 40%',
  },
  'iba-rd': {
    src: '/covers/about.jpg',
    srcDark: '/covers/about-dark.jpg',
    alt: 'Design workspace — IBA R&D Applications',
    objectPosition: 'center 40%',
    objectPositionDark: 'left 42%',
  },
  'docu-nest': {
    src: '/covers/projects.jpg',
    alt: 'Code editor — Docu-Nest',
    objectPosition: 'right 35%',
  },
  'scribe-notes': {
    src: '/covers/about.jpg',
    srcDark: '/covers/about-dark.jpg',
    alt: 'Writing workspace — Scribe Notes',
    objectPosition: 'center 50%',
    objectPositionDark: 'center 40%',
  },
  'boom-scope': {
    src: '/covers/tech.jpg',
    alt: 'Design workspace — Boom Scope',
    objectPosition: 'center 30%',
  },
  'pulse-apiclient': {
    src: '/covers/contact.jpg',
    alt: 'Developer tools — Pulse API Client',
    objectPosition: 'left 50%',
  },
  'spst-kniznica': {
    src: '/covers/experience.jpg',
    alt: 'Collaboration — SPST Knižnica',
    objectPosition: 'right 40%',
  },
}

export function getProjectCover(projectId: string): PageCoverImage | undefined {
  return projectCoverImages[projectId]
}

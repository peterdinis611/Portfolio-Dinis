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

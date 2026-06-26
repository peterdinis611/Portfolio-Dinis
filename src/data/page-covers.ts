export type PageCoverVariant = 'about' | 'tech' | 'experience' | 'projects' | 'contact'

/** Notion-style page cover images (Unsplash, stored in /public/covers). */
export const pageCoverImages: Record<PageCoverVariant, { src: string; alt: string }> = {
  about: {
    src: '/covers/about.jpg',
    alt: 'Laptop with code on a desk',
  },
  tech: {
    src: '/covers/tech.jpg',
    alt: 'Source code on a screen',
  },
  experience: {
    src: '/covers/experience.jpg',
    alt: 'Developers collaborating at a laptop',
  },
  projects: {
    src: '/covers/projects.jpg',
    alt: 'Code editor on a monitor',
  },
  contact: {
    src: '/covers/contact.jpg',
    alt: 'Developer workspace with laptop',
  },
}

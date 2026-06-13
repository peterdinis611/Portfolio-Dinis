export type Project = {
  id: string
  name: string
  tech: string
  liveUrl?: string
  githubUrl?: string
}

export type SocialLink = {
  name: string
  icon: string
  url: string
}

export const profile = {
  name: 'Peter Dinis',
  phone: '+421 950 460 254',
  phoneHref: '+421950460254',
  interests: [
    'React',
    'TypeScript',
    'Next.js',
    'Node.js',
    'NestJS',
    'PostgreSQL',
    'MongoDB',
    'GraphQL',
    'Tailwind CSS',
    'Docker',
    'AWS',
    'Azure',
    'React Native',
    'UI/UX',
    'Design Systems',
  ],
}

export const projects: Project[] = [
  {
    id: 'legato',
    name: 'Legato',
    tech: 'React · TypeScript · React Query',
  },
  {
    id: 'carter',
    name: 'Carter Print Portal',
    tech: 'React · Redux · Styled Components',
  },
  {
    id: 'library',
    name: 'School Library System',
    tech: 'React · Node.js · MongoDB',
  },
  {
    id: 'licenses',
    name: 'License E-shop',
    tech: 'Vue · NestJS · PostgreSQL',
  },
]

export const socials: SocialLink[] = [
  { name: 'GitHub', icon: 'github', url: 'https://github.com' },
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com' },
]

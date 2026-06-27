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
    'System Design',
    'Architecture',
    'React',
    'TypeScript',
    'Next.js',
    'Node.js',
    'NestJS',
    'PostgreSQL',
    'Design Systems',
    'Technical Leadership',
    'Mentoring',
    'AWS',
    'Docker',
    'UI/UX',
  ],
}

export const projects: Project[] = [
  {
    id: 'udzs',
    name: 'ÚDZS Platform',
    tech: 'React · TypeScript · Java · PostgreSQL · Docker',
  },
  {
    id: 'eforms',
    name: 'EForms',
    tech: 'React · TypeScript · TanStack Query · PostgreSQL',
  },
  {
    id: 'prolekare',
    name: 'prolekare.cz',
    tech: 'React · Next.js · TypeScript · Tailwind · AWS S3',
  },
  {
    id: 'licenses',
    name: 'Enterprise License System',
    tech: 'NestJS · PostgreSQL · Vue.js · AWS',
  },
  {
    id: 'iba-rd',
    name: 'IBA R&D Applications',
    tech: 'React · Fluent UI · SharePoint · Figma',
  },
]

export const socials: SocialLink[] = [
  { name: 'GitHub', icon: 'github', url: 'https://github.com/peterdinis' },
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/in/peterdinis' },
]

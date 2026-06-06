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
  email: 'peterdinis611@gmail.com',
  phone: '+421 950 460 254',
  phoneHref: '+421950460254',
  interests: ['React', 'TypeScript', 'UI/UX', 'Design Systems', 'Node.js'],
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

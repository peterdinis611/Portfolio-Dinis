export type ProjectCategory = 'personal'

export type ProjectListId = 'my-projects'

export type Project = {
  id: string
  name: string
  tech: string
  category: ProjectCategory
  liveUrl?: string
  githubUrl?: string
}

export type SocialLink = {
  name: string
  icon: string
  url: string
}

export const PROJECT_LIST_BY_CATEGORY: Record<ProjectListId, ProjectCategory> = {
  'my-projects': 'personal',
}

export const PROJECT_CATEGORY_BY_LIST: Record<ProjectCategory, ProjectListId> = {
  personal: 'my-projects',
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
    id: 'docu-nest',
    name: 'Docu-Nest',
    tech: 'Next.js · TypeScript · Drizzle · SQLite · Clerk · XState',
    category: 'personal',
    githubUrl: 'https://github.com/peterdinis611/Docu-Nest',
  },
  {
    id: 'scribe-notes',
    name: 'Scribe Notes',
    tech: 'Tauri · React · TypeScript · TipTap · SQLite · Tailwind',
    category: 'personal',
    githubUrl: 'https://github.com/peterdinis611/Scribe-Notes-App',
  },
  {
    id: 'boom-scope',
    name: 'Boom Scope',
    tech: 'Next.js · React · Convex · TipTap · Konva · OpenAI · Tailwind',
    category: 'personal',
    githubUrl: 'https://github.com/peterdinis611/Boom-Scope',
    liveUrl: 'https://boom-scope.vercel.app',
  },
  {
    id: 'pulse-apiclient',
    name: 'Pulse API Client',
    tech: 'Tauri · React · TypeScript · Rust · XState · SQLite',
    category: 'personal',
    githubUrl: 'https://github.com/peterdinis611/Pulse-ApiClient',
  },
  {
    id: 'spst-kniznica',
    name: 'SPST Knižnica',
    tech: 'TanStack Start · React · PostgreSQL · Drizzle · Auth.js · Tailwind',
    category: 'personal',
    githubUrl: 'https://github.com/peterdinis611/Spst-Kniznica',
    liveUrl: 'https://spst-kniznica.vercel.app',
  },
]

export const personalProjects = projects

export function getProjectsForList(listId?: ProjectListId): Project[] {
  if (!listId) return projects
  const category = PROJECT_LIST_BY_CATEGORY[listId]
  return projects.filter((project) => project.category === category)
}

export const socials: SocialLink[] = [
  { name: 'GitHub', icon: 'github', url: 'https://github.com/peterdinis' },
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/in/peter-dinis-58520b214/' },
]

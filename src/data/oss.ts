import type { Localized } from '@/data/availability'
import { projects } from '@/data/portfolio'

export type OssLinkItem = {
  id: string
  title: string
  href: string
  blurb: Localized
  kind: 'repo' | 'live' | 'talk' | 'community'
}

/** Open-source repos from portfolio projects (GitHub). */
export const ossRepos: OssLinkItem[] = projects
  .filter((project) => Boolean(project.githubUrl))
  .map((project) => ({
    id: project.id,
    title: project.name,
    href: project.githubUrl as string,
    kind: 'repo' as const,
    blurb: {
      sk: project.tech,
      en: project.tech,
    },
  }))

export const ossTalks: Array<Omit<OssLinkItem, 'href'> & { href?: string; toContact?: boolean }> = [
  {
    id: 'open-to-speak',
    title: 'Open to speak',
    toContact: true,
    kind: 'talk',
    blurb: {
      sk: 'Zatiaľ bez verejných talkov — otvorený meetupom / lightning talks o React, design systémoch a mentoringu.',
      en: 'No public talks yet — open to meetups / lightning talks on React, design systems, and mentoring.',
    },
  },
]

export const ossCommunity: Localized[] = [
  {
    sk: 'Aktívny na GitHub — osobné nástroje (Tauri, Next.js, Convex) a študentské produkty.',
    en: 'Active on GitHub — personal tools (Tauri, Next.js, Convex) and student products.',
  },
  {
    sk: 'Mentoring a code-review kultúra v tímoch — nie len vlastné PRčka.',
    en: 'Mentoring and code-review culture in teams — not only my own PRs.',
  },
]

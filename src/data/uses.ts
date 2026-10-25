import type { Localized } from '@/data/availability'

export type UsesItem = {
  name: string
  detail: Localized
}

export type UsesGroup = {
  id: string
  title: Localized
  items: UsesItem[]
}

/** Personal toolkit — hobby signal, keep honest and short. */
export const usesGroups: UsesGroup[] = [
  {
    id: 'editor',
    title: { sk: 'Editor & AI', en: 'Editor & AI' },
    items: [
      {
        name: 'Cursor',
        detail: {
          sk: 'Hlavný editor — agent workflow + TypeScript refactoring',
          en: 'Primary editor — agent workflow + TypeScript refactoring',
        },
      },
      {
        name: 'VS Code',
        detail: {
          sk: 'Záloha, diffy, občas remote SSH',
          en: 'Backup, diffs, occasional remote SSH',
        },
      },
    ],
  },
  {
    id: 'stack',
    title: { sk: 'Denný stack', en: 'Daily stack' },
    items: [
      {
        name: 'React · TypeScript · Next.js',
        detail: {
          sk: 'Produktový frontend a full-stack appky',
          en: 'Product frontend and full-stack apps',
        },
      },
      {
        name: 'Node · NestJS · PostgreSQL',
        detail: {
          sk: 'API, auth, doménová logika',
          en: 'APIs, auth, domain logic',
        },
      },
      {
        name: 'Tailwind · Fluent UI',
        detail: {
          sk: 'Rýchle UI + enterprise design systémy',
          en: 'Fast UI + enterprise design systems',
        },
      },
    ],
  },
  {
    id: 'workflow',
    title: { sk: 'Workflow', en: 'Workflow' },
    items: [
      {
        name: 'GitHub',
        detail: {
          sk: 'PRs, Actions, code review',
          en: 'PRs, Actions, code review',
        },
      },
      {
        name: 'Figma',
        detail: {
          sk: 'Design handoff a design-system tokeny',
          en: 'Design handoff and design-system tokens',
        },
      },
      {
        name: 'Jira / Linear-style boards',
        detail: {
          sk: 'Delivery v produkčných tímoch',
          en: 'Delivery in production teams',
        },
      },
      {
        name: 'Terminal · bun / npm',
        detail: {
          sk: 'Lokálny tooling, skripty, monorepo návyky',
          en: 'Local tooling, scripts, monorepo habits',
        },
      },
    ],
  },
]

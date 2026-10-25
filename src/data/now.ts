import type { Localized } from '@/data/availability'
import { availability } from '@/data/availability'

/** Living “Now” snapshot — edit this file when focus shifts. */
export const nowSnapshot = {
  /** ISO month for “updated” line */
  updated: '2026-10',
  availability,
  focusing: [
    {
      sk: 'R&D vo Fluent UI / design systémoch v IBA.CZ',
      en: 'R&D on Fluent UI / design systems at IBA.CZ',
    },
    {
      sk: 'Side projekty — Pulse API Client, Docu-Nest, Boom Scope',
      en: 'Side projects — Pulse API Client, Docu-Nest, Boom Scope',
    },
    {
      sk: 'Písanie notes o React performance, a11y a mentoringu',
      en: 'Writing notes on React performance, a11y, and mentoring',
    },
  ] satisfies Localized[],
  teaching: [
    {
      sk: 'Mentoring juniorov — code review, systémové myslenie',
      en: 'Mentoring juniors — code review, systems thinking',
    },
    {
      sk: 'Zdieľanie praxe cez blog (design systémy, TypeScript, API)',
      en: 'Sharing practice via the blog (design systems, TypeScript, APIs)',
    },
  ] satisfies Localized[],
  lookingFor: [
    {
      sk: 'Produktová full-stack / React rola (medior–senior)',
      en: 'Product full-stack / React role (medior–senior)',
    },
    {
      sk: 'Hybrid Praha alebo remote v EU · ownership nad feature',
      en: 'Hybrid Prague or EU remote · ownership over features',
    },
    {
      sk: 'Tím, kde countí architektúra, DX a mentoring',
      en: 'A team that values architecture, DX, and mentoring',
    },
  ] satisfies Localized[],
  notLookingFor: [
    {
      sk: 'Čistý CMS / landing-page factory bez technického vplyvu',
      en: 'Pure CMS / landing-page factory with no technical leverage',
    },
    {
      sk: 'Role bez code review a bez priestoru na craft',
      en: 'Roles without code review or room for craft',
    },
  ] satisfies Localized[],
}

export function formatNowUpdated(lang: 'sk' | 'en', isoMonth: string): string {
  const [year, month] = isoMonth.split('-').map(Number)
  if (!year || !month) return isoMonth
  if (lang === 'sk') {
    const names = [
      'január',
      'február',
      'marec',
      'apríl',
      'máj',
      'jún',
      'júl',
      'august',
      'september',
      'október',
      'november',
      'december',
    ]
    return `${names[month - 1]} ${year}`
  }
  const date = new Date(Date.UTC(year, month - 1, 1))
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

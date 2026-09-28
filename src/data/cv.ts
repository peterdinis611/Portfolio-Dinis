import type { Localized } from '@/data/availability'

/** Structured CV content aligned with the latest printable résumé (+ current IBA role). */
export const cvMeta = {
  pdfHref: '/cv/Peter-Dinis-CV.pdf',
  pdfFileName: 'Peter-Dinis-CV.pdf',
  targetRole: {
    sk: 'Medior / Senior Full-Stack alebo React Developer (CZ / remote)',
    en: 'Medior / Senior Full-Stack or React Developer (CZ / remote)',
  } satisfies Localized,
  availabilityLine: {
    sk: 'Nie okamžite · EU občan · otvorený relokácii',
    en: 'Not immediate · EU citizen · open to relocation',
  } satisfies Localized,
  summary: {
    sk: 'Full-stack developer s 4+ rokmi skúseností — škálovateľné React & Node.js aplikácie, frontend optimalizácia, backend architektúra a mentoring. Dodávky pre healthcare, verejný sektor a enterprise. Hľadám produktovú full-stack alebo React rolu.',
    en: 'Full-stack developer with 4+ years building scalable React & Node.js apps — frontend optimization, backend architecture, and mentoring. Track record in healthcare, public sector, and enterprise. Seeking a product full-stack or React role.',
  } satisfies Localized,
}

export const cvSkillGroups: Array<{
  id: string
  title: Localized
  items: string[]
}> = [
  {
    id: 'frontend',
    title: { sk: 'Frontend', en: 'Frontend' },
    items: [
      'React',
      'Next.js',
      'TypeScript',
      'TanStack Query',
      'Redux',
      'tRPC',
      'WebSockets',
      'Tailwind',
      'Sass/SCSS',
      'Fluent UI',
    ],
  },
  {
    id: 'backend',
    title: { sk: 'Backend', en: 'Backend' },
    items: [
      'Node.js',
      'NestJS',
      'Express',
      'REST',
      'GraphQL',
      'Microservices',
      'PostgreSQL',
      'MongoDB',
      'MySQL',
    ],
  },
  {
    id: 'cloud',
    title: { sk: 'Cloud & DevOps', en: 'Cloud & DevOps' },
    items: ['Docker', 'AWS', 'GitHub Actions', 'GitLab CI/CD', 'Vercel', 'Linux'],
  },
  {
    id: 'craft',
    title: { sk: 'Craft & tools', en: 'Craft & tools' },
    items: ['Jest', 'Git', 'Jira', 'Figma', 'XState', 'C#', 'SQL'],
  },
]

export const cvCompetencies: Localized[] = [
  {
    sk: 'Technický leadership — mentoring, code review, cross-functional spolupráca',
    en: 'Technical leadership — mentoring, code reviews, cross-functional collaboration',
  },
  {
    sk: 'Architektúra a performance — systémový návrh, optimalizácia, debugging',
    en: 'Architecture & performance — system design, optimization, debugging',
  },
  {
    sk: 'Dodávka — Agile/Scrum, timeline, riziko, QA',
    en: 'Delivery — Agile/Scrum, timelines, risk, QA',
  },
  {
    sk: 'Komunikácia — stakeholderi, technická dokumentácia',
    en: 'Communication — stakeholders, technical documentation',
  },
]

export const cvEducation: Array<{
  id: string
  school: Localized
  detail: Localized
  period: string
  bullets?: Localized[]
}> = [
  {
    id: 'uniza',
    school: {
      sk: 'Žilinská univerzita — Informatika',
      en: 'University of Žilina — Computer Science',
    },
    detail: {
      sk: 'Praktický softvérový vývoj a stáže',
      en: 'Practical software development and real-world internships',
    },
    period: '2020 — 2021',
  },
  {
    id: 'spst',
    school: {
      sk: 'SPŠT Bardejov — Technické lýceum (IT)',
      en: 'Secondary Technical School, Bardejov — Technical Lyceum (IT)',
    },
    detail: {
      sk: 'Absolvent s vyznamenaním (GPA 3.8/4.0)',
      en: 'Graduated with honors (GPA 3.8/4.0)',
    },
    period: '2016 — 2020',
    bullets: [
      { sk: 'Erasmus stáž v Prahe', en: 'Erasmus internship in Prague' },
      {
        sk: '3 regionálne víťazstvá v softvérových súťažiach',
        en: '3 regional software competition wins',
      },
    ],
  },
]

export const cvCertifications: Localized[] = [
  {
    sk: 'React Advanced Patterns & Performance',
    en: 'React Advanced Patterns & Performance',
  },
  {
    sk: 'Modern JavaScript & TypeScript Best Practices',
    en: 'Modern JavaScript & TypeScript Best Practices',
  },
  {
    sk: 'Microservices Architecture Design',
    en: 'Microservices Architecture Design',
  },
  {
    sk: 'Node.js & C# Modern Practices',
    en: 'Node.js & C# Modern Practices',
  },
]

export const cvLanguages: Array<{ name: Localized; level: Localized }> = [
  {
    name: { sk: 'Slovenčina', en: 'Slovak' },
    level: { sk: 'Rodný jazyk', en: 'Native' },
  },
  {
    name: { sk: 'Angličtina', en: 'English' },
    level: { sk: 'B2', en: 'B2' },
  },
  {
    name: { sk: 'Čeština', en: 'Czech' },
    level: { sk: 'Konverzačne', en: 'Conversational' },
  },
]

export const cvLeadership: Localized = {
  sk: 'Viedol frontend tím, 50+ code review, mentoring juniorov',
  en: 'Led frontend team, 50+ code reviews, mentored juniors',
}

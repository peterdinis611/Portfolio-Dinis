import type { Lang } from '@/i18n/translations'

export type ProfileFacts = {
  livesIn: string
  education: string
  speaks: string
  loves: string
}

export type SkillCard = {
  id: string
  icon: string
  title: string
  description: string
}

export type ProjectPageMeta = {
  type: string
  date?: string
}

export const aboutTemplateContent: Record<
  Lang,
  {
    greeting: string
    aboutShort: string
    contactShort: string
    profileFacts: ProfileFacts
    skillsTitle: string
    skillsIntro: string
    skills: SkillCard[]
    aboutSection: string
    contactSection: string
    livesInLabel: string
    educationLabel: string
    speaksLabel: string
    lovesLabel: string
  }
> = {
  sk: {
    greeting: 'Ahoj, som',
    aboutShort: 'Full-stack developer cez deň · side projekty v noci',
    contactShort:
      'Ak hľadáš niekoho, kto spojí solídny kód s citom pre UX — napíš mi. Rád sa porozprávam o produktoch, tíme alebo novej spolupráci.',
    profileFacts: {
      livesIn: 'Praha, Česko',
      education: 'SPŠT Bardejov — Informačné technológie',
      speaks: 'Slovenčina, Angličtina (B2), Čeština',
      loves: 'React, hry, turistika',
    },
    skillsTitle: 'Moje schopnosti',
    skillsIntro:
      'Zameriavam sa na produkčný vývoj naprieč frontendom, backendom a UX — od návrhu po deploy.',
    skills: [
      {
        id: '01',
        icon: '🏗️',
        title: 'Produktové inžinierstvo',
        description: 'Architektúra a dodávka riešení od prvého nápadu po produkčný kód.',
      },
      {
        id: '02',
        icon: '🎨',
        title: 'Design systémy & UI',
        description:
          'Komponentové knižnice, Figma a konzistentné rozhrania vo Fluent UI či Tailwind.',
      },
      {
        id: '03',
        icon: '⚙️',
        title: 'Backend & API',
        description: 'REST API, databázy, integrácie a škálovateľné služby v Node.js a NestJS.',
      },
      {
        id: '04',
        icon: '🧭',
        title: 'Mentoring & tímová práca',
        description: 'Mentoring juniorov, code review a zlepšovanie spolupráce v agile tíme.',
      },
    ],
    aboutSection: 'O mne',
    contactSection: 'Kontaktuj ma',
    livesInLabel: 'Bývam v',
    educationLabel: 'Vzdelanie',
    speaksLabel: 'Hovorím',
    lovesLabel: 'Milujem',
  },
  en: {
    greeting: "Hi, I'm a",
    aboutShort: 'Full-stack developer by day · side projects by night',
    contactShort:
      'If you need someone who combines solid code with UX thinking — reach out. Happy to talk products, teams, or new collaborations.',
    profileFacts: {
      livesIn: 'Prague, Czech Republic',
      education: 'SPŠT Bardejov — Information Technology',
      speaks: 'Slovak, English (B2), Czech',
      loves: 'React, gaming, hiking',
    },
    skillsTitle: 'My skills',
    skillsIntro:
      'I focus on production development across frontend, backend, and UX — from design to deployment.',
    skills: [
      {
        id: '01',
        icon: '🏗️',
        title: 'Product engineering',
        description: 'Architecture and delivery from first idea to production-ready code.',
      },
      {
        id: '02',
        icon: '🎨',
        title: 'Design systems & UI',
        description:
          'Component libraries, Figma, and consistent interfaces with Fluent UI or Tailwind.',
      },
      {
        id: '03',
        icon: '⚙️',
        title: 'Backend & APIs',
        description:
          'REST APIs, databases, integrations, and scalable services with Node.js and NestJS.',
      },
      {
        id: '04',
        icon: '🧭',
        title: 'Mentoring & teamwork',
        description: 'Junior mentoring, code reviews, and improving collaboration in agile teams.',
      },
    ],
    aboutSection: 'About',
    contactSection: 'Contact me',
    livesInLabel: 'Lives in',
    educationLabel: 'Education',
    speaksLabel: 'Speaks',
    lovesLabel: 'Loves',
  },
}

/** Slim per-project metadata for detail pages and project lists. */
export const projectMeta: Record<Lang, Record<string, ProjectPageMeta>> = {
  sk: {
    'docu-nest': { type: 'SIDE PROJECT', date: 'jún 2026' },
    'scribe-notes': { type: 'DESKTOP APP', date: 'jún 2026' },
    'boom-scope': { type: 'SIDE PROJECT', date: 'máj — jún 2026' },
    'pulse-apiclient': { type: 'DESKTOP APP', date: 'jún 2026' },
    'spst-kniznica': { type: 'SIDE PROJECT', date: 'máj — jún 2026' },
  },
  en: {
    'docu-nest': { type: 'SIDE PROJECT', date: 'Jun 2026' },
    'scribe-notes': { type: 'DESKTOP APP', date: 'Jun 2026' },
    'boom-scope': { type: 'SIDE PROJECT', date: 'May — Jun 2026' },
    'pulse-apiclient': { type: 'DESKTOP APP', date: 'Jun 2026' },
    'spst-kniznica': { type: 'SIDE PROJECT', date: 'May — Jun 2026' },
  },
}

export const projectPageUi: Record<
  Lang,
  {
    myRole: string
    date: string
    projectType: string
    toolsUsed: string
    backToProjects: string
    previousProject: string
    nextProject: string
    sourceCode: string
    liveDemo: string
    dbName: string
    dbType: string
    dbStack: string
  }
> = {
  sk: {
    myRole: 'Moja rola',
    date: 'Dátum',
    projectType: 'Typ projektu',
    toolsUsed: 'Použité nástroje',
    backToProjects: 'Späť na projekty',
    previousProject: 'Predošlý',
    nextProject: 'Ďalší',
    sourceCode: 'Zdrojový kód na GitHub',
    liveDemo: 'Live demo',
    dbName: 'Názov',
    dbType: 'Typ',
    dbStack: 'Stack',
  },
  en: {
    myRole: 'My Role',
    date: 'Date',
    projectType: 'Project type',
    toolsUsed: 'Tools used',
    backToProjects: 'Back to projects',
    previousProject: 'Previous',
    nextProject: 'Next',
    sourceCode: 'Source code on GitHub',
    liveDemo: 'Live demo',
    dbName: 'Name',
    dbType: 'Type',
    dbStack: 'Stack',
  },
}

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

export type ProjectCaseStudy = {
  roles: string[]
  date: string
  type: string
  overview: string
  problem: string
  solution: string
  features: string[]
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
      speaks: 'Slovenčina, Angličtina',
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
        description: 'Komponentové knižnice, Figma a konzistentné rozhrania vo Fluent UI či Tailwind.',
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
      speaks: 'Slovak, English',
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
        description: 'Component libraries, Figma, and consistent interfaces with Fluent UI or Tailwind.',
      },
      {
        id: '03',
        icon: '⚙️',
        title: 'Backend & APIs',
        description: 'REST APIs, databases, integrations, and scalable services with Node.js and NestJS.',
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

export const caseStudyContent: Record<Lang, Record<string, ProjectCaseStudy>> = {
  sk: {
    'docu-nest': {
      roles: ['Full-Stack Developer'],
      date: 'jún 2026',
      type: 'SIDE PROJECT',
      overview:
        'AI-powered platforma pre dokumentové notebooky — knižnica, analytika a workspace s Clerk auth a Drizzle ORM.',
      problem:
        'Dokumenty a poznámky boli roztrúsené bez prehľadnej štruktúry, vyhľadávania a stavu workflow.',
      solution:
        'Next.js App Router aplikácia s XState strojmi, SQLite databázou a modulárnou architektúrou views a komponentov.',
      features: [
        'Dashboard, knižnica dokumentov a analytika',
        'Notebook workspace s vyhľadávaním',
        'Drizzle migrácie, seed a Drizzle Studio',
      ],
    },
    'scribe-notes': {
      roles: ['Full-Stack Developer'],
      date: 'jún 2026',
      type: 'DESKTOP APP',
      overview:
        'macOS desktopová aplikácia pre písanie dokumentov — TipTap editor, stromová štruktúra a lokálne SQLite úložisko.',
      problem:
        'Potreba čistého rich-text editora s organizáciou súborov, offline prístupom a natívnym desktop zážitkom.',
      solution:
        'Tauri 2 + React aplikácia s TipTap, Jotai state, Rust commands a FTS5 fulltextovým vyhľadávaním.',
      features: [
        'Slash commands, Cmd+K vyhľadávanie a drag & drop',
        'Export PDF, DOCX a Markdown',
        'Tabuľky, obrázky, komentáre a undo história',
      ],
    },
    'boom-scope': {
      roles: ['Full-Stack Developer'],
      date: 'máj — jún 2026',
      type: 'SIDE PROJECT',
      overview:
        'Full-stack design workspace — projekty, rich notes, canvas, AI design systém a Pomodoro timer na Convex backende.',
      problem:
        'Kreatívna práca vyžadovala jeden nástroj na poznámky, vizuálny návrh, design tokeny a produktivitu.',
      solution:
        'Next.js 16 dashboard s TipTap, Konva canvasom, OpenAI generátorom a Convex Auth s real-time dátami.',
      features: [
        'Projekty, poznámky a infinite canvas',
        'AI generovanie design systémov a layoutov',
        'Pomodoro timer, dark mode a Vitest testy',
      ],
    },
    'pulse-apiclient': {
      roles: ['Full-Stack Developer'],
      date: 'jún 2026',
      type: 'DESKTOP APP',
      overview:
        'Desktop API klient v štýle Postman — HTTP requesty, kolekcie, prostredia a história v Tauri + Rust.',
      problem:
        'Webové API nástroje neponúkali rýchly natívny zážitok, offline históriu a plnú kontrolu nad request engine.',
      solution:
        'Tauri 2 aplikácia s XState orchestráciou, reqwest HTTP engine v Ruste a SQLite per-user úložiskom.',
      features: [
        'GET/POST/PUT/PATCH/DELETE s auth a multipart',
        'Import Postman/OpenAPI, kolekcie a runner',
        'WebSocket klient, témy a fuzzy search',
      ],
    },
    'spst-kniznica': {
      roles: ['Full-Stack Developer'],
      date: 'máj — jún 2026',
      type: 'SIDE PROJECT',
      overview:
        'Študentská digitálna knižnica pre SPST — katalóg kníh, výpožičky, admin panel a notifikácie.',
      problem:
        'Škola potrebovala moderný online katalóg s objednávkami, kontrolou skladu a administračným workflow.',
      solution:
        'TanStack Start aplikácia s PostgreSQL, Drizzle ORM, Auth.js a atomickými transakciami pri výpožičkách.',
      features: [
        'Katalóg, obľúbené a študentské objednávky',
        'Admin dashboard, audit log a whitelist',
        'Client/server cache, stress testy a SEO',
      ],
    },
  },
  en: {
    'docu-nest': {
      roles: ['Full-Stack Developer'],
      date: 'Jun 2026',
      type: 'SIDE PROJECT',
      overview:
        'AI-powered document notebook platform — library, analytics, and workspace with Clerk auth and Drizzle ORM.',
      problem:
        'Documents and notes were scattered without clear structure, search, or workflow state management.',
      solution:
        'Next.js App Router app with XState machines, SQLite database, and modular views and component architecture.',
      features: [
        'Dashboard, document library, and analytics',
        'Notebook workspace with search',
        'Drizzle migrations, seed, and Drizzle Studio',
      ],
    },
    'scribe-notes': {
      roles: ['Full-Stack Developer'],
      date: 'Jun 2026',
      type: 'DESKTOP APP',
      overview:
        'macOS desktop writing app — TipTap editor, tree-structured files, and local SQLite storage.',
      problem:
        'Need for a clean rich-text editor with file organization, offline access, and a native desktop experience.',
      solution:
        'Tauri 2 + React app with TipTap, Jotai state, Rust commands, and FTS5 full-text search.',
      features: [
        'Slash commands, Cmd+K search, and drag & drop',
        'Export PDF, DOCX, and Markdown',
        'Tables, images, comments, and undo history',
      ],
    },
    'boom-scope': {
      roles: ['Full-Stack Developer'],
      date: 'May — Jun 2026',
      type: 'SIDE PROJECT',
      overview:
        'Full-stack design workspace — projects, rich notes, canvas, AI design system, and Pomodoro timer on Convex.',
      problem:
        'Creative work needed one tool for notes, visual design, design tokens, and productivity.',
      solution:
        'Next.js 16 dashboard with TipTap, Konva canvas, OpenAI generator, and Convex Auth with real-time data.',
      features: [
        'Projects, notes, and infinite canvas',
        'AI design system and layout generation',
        'Pomodoro timer, dark mode, and Vitest tests',
      ],
    },
    'pulse-apiclient': {
      roles: ['Full-Stack Developer'],
      date: 'Jun 2026',
      type: 'DESKTOP APP',
      overview:
        'Desktop API client inspired by Postman — HTTP requests, collections, environments, and history in Tauri + Rust.',
      problem:
        'Web API tools lacked a fast native experience, offline history, and full control over the request engine.',
      solution:
        'Tauri 2 app with XState orchestration, reqwest HTTP engine in Rust, and per-user SQLite storage.',
      features: [
        'GET/POST/PUT/PATCH/DELETE with auth and multipart',
        'Postman/OpenAPI import, collections, and runner',
        'WebSocket client, themes, and fuzzy search',
      ],
    },
    'spst-kniznica': {
      roles: ['Full-Stack Developer'],
      date: 'May — Jun 2026',
      type: 'SIDE PROJECT',
      overview:
        'Student digital library for SPST — book catalog, loans, admin panel, and notifications.',
      problem:
        'The school needed a modern online catalog with orders, inventory control, and admin workflows.',
      solution:
        'TanStack Start app with PostgreSQL, Drizzle ORM, Auth.js, and atomic transactions for book loans.',
      features: [
        'Catalog, favorites, and student orders',
        'Admin dashboard, audit log, and whitelist',
        'Client/server cache, stress tests, and SEO',
      ],
    },
  },
}

export const caseStudyUi: Record<
  Lang,
  {
    myRole: string
    date: string
    projectType: string
    toolsUsed: string
    overview: string
    problem: string
    solution: string
    mainFeatures: string
    backToProjects: string
    previousProject: string
    nextProject: string
    sourceCode: string
    liveDemo: string
    linksTitle: string
    openCaseStudy: string
    closePreview: string
    impactTitle: string
    mediaTitle: string
    mediaTitleAnonymized: string
    anonymizedNote: string
    roleOutcomeTitle: string
    architectureTitle: string
    beforeAfterTitle: string
    beforeLabel: string
    afterLabel: string
    demoTitle: string
    openLiveDemo: string
    viewSource: string
    tryLive: string
    hideLive: string
    dbName: string
    dbType: string
    dbStack: string
    dbDescription: string
  }
> = {
  sk: {
    myRole: 'Moja rola',
    date: 'Dátum',
    projectType: 'Typ projektu',
    toolsUsed: 'Použité nástroje',
    overview: '1. Prehľad',
    problem: 'Problém',
    solution: 'Riešenie',
    mainFeatures: 'Hlavné funkcie',
    backToProjects: 'Späť na projekty',
    previousProject: 'Predošlý',
    nextProject: 'Ďalší',
    sourceCode: 'Zdrojový kód na GitHub',
    liveDemo: 'Live demo',
    linksTitle: 'Odkazy',
    openCaseStudy: 'Otvoriť case study',
    closePreview: 'Zavrieť',
    impactTitle: 'Dopad v číslach',
    mediaTitle: 'Produktový preview',
    mediaTitleAnonymized: 'UI concept (anonymized)',
    anonymizedNote:
      'Kvôli NDA nie sú zobrazené reálne screenshoty klienta — len anonymizovaný UI concept a architektonický dôkaz.',
    roleOutcomeTitle: 'Rola → výsledok',
    architectureTitle: 'Architektúra (bez brandingu)',
    beforeAfterTitle: 'Pred → po',
    beforeLabel: 'Pred',
    afterLabel: 'Po',
    demoTitle: 'Demo',
    openLiveDemo: 'Otvoriť live demo',
    viewSource: 'Zobraziť zdroj',
    tryLive: 'Vyskúšať v stránke',
    hideLive: 'Skryť live preview',
    dbName: 'Názov',
    dbType: 'Typ',
    dbStack: 'Stack',
    dbDescription: 'Popis',
  },
  en: {
    myRole: 'My Role',
    date: 'Date',
    projectType: 'Project type',
    toolsUsed: 'Tools used',
    overview: '1. Overview',
    problem: 'Problem Statement',
    solution: 'Solution',
    mainFeatures: 'Main Features',
    backToProjects: 'Back to projects',
    previousProject: 'Previous',
    nextProject: 'Next',
    sourceCode: 'Source code on GitHub',
    liveDemo: 'Live demo',
    linksTitle: 'Links',
    openCaseStudy: 'Open case study',
    closePreview: 'Close',
    impactTitle: 'Impact in numbers',
    mediaTitle: 'Product preview',
    mediaTitleAnonymized: 'UI concept (anonymized)',
    anonymizedNote:
      'Due to NDA, real client screenshots are not shown — only an anonymized UI concept and architectural proof.',
    roleOutcomeTitle: 'Role → outcome',
    architectureTitle: 'Architecture (unbranded)',
    beforeAfterTitle: 'Before → after',
    beforeLabel: 'Before',
    afterLabel: 'After',
    demoTitle: 'Demo',
    openLiveDemo: 'Open live demo',
    viewSource: 'View source',
    tryLive: 'Try in page',
    hideLive: 'Hide live preview',
    dbName: 'Name',
    dbType: 'Type',
    dbStack: 'Stack',
    dbDescription: 'Description',
  },
}

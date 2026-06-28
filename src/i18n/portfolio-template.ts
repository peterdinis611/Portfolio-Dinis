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
    greeting: 'Ahoj 👋 som',
    aboutShort: 'Full-stack developer cez deň ☀️ · side projekty v noci 🌙',
    contactShort:
      'Ak hľadáš niekoho, kto spojí solídny kód s citom pre UX — napíš mi. Rád sa porozprávam o produktoch, tíme alebo novej spolupráci.',
    profileFacts: {
      livesIn: 'Praha, Česko',
      education: 'SPŠT Bardejov — Informačné technológie',
      speaks: 'Slovenčina, Angličtina',
      loves: 'React, hry, turistika',
    },
    skillsTitle: '👑 Moje schopnosti',
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
    greeting: "Hi 👋 I'm a",
    aboutShort: 'Full-stack developer by day ☀️ · side projects by night 🌙',
    contactShort:
      'If you need someone who combines solid code with UX thinking — reach out. Happy to talk products, teams, or new collaborations.',
    profileFacts: {
      livesIn: 'Prague, Czech Republic',
      education: 'SPŠT Bardejov — Information Technology',
      speaks: 'Slovak, English',
      loves: 'React, gaming, hiking',
    },
    skillsTitle: '👑 My Skills',
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
    udzs: {
      roles: ['Full-Stack Developer'],
      date: 'mar 2023 — máj 2024',
      type: 'WORK APP',
      overview:
        'Platforma pre verejný sektor s 500+ aktívnymi používateľmi. Zodpovedal som za frontend, integráciu s backendom a produkčný deploy.',
      problem:
        'Manuálne procesy a nestabilná staršia aplikácia spomaľovali prácu stovkám používateľov denne.',
      solution:
        'Nový React frontend s optimalizovaným workflow, Docker deployom a monitoringom pre 99,9 % uptime.',
      features: [
        'Dashboard pre správu používateľov a rolí',
        'Optimalizované načítanie a responzívne UI',
        'Produkčný monitoring a Docker pipeline',
      ],
    },
    eforms: {
      roles: ['Full-Stack Developer'],
      date: 'mar 2023 — máj 2024',
      type: 'WORK APP',
      overview:
        'Firemná platforma na spracovanie formulárov s 1 000+ dennými odoslaniami. Full-stack vývoj a optimalizácia workflow.',
      problem:
        'Pomalé spracovanie formulárov a neprehľadné interné procesy zaťažovali HR a administratívu.',
      solution:
        'React aplikácia s TanStack Query, validáciou a backend integráciou — HR procesy kratšie o 60 %.',
      features: [
        'Dynamické formuláre s validáciou',
        'Integrácia s backend API a export dát',
        'Zrýchlenie frontendu o 40 %',
      ],
    },
    prolekare: {
      roles: ['Frontend Developer'],
      date: 'okt 2024 — júl 2025',
      type: 'HEALTHCARE',
      overview:
        'Frontend pre prolekare.cz a interné zdravotnícke aplikácie. Komponentová knižnica a AWS S3 pre assety.',
      problem:
        'Nekonzistentné UI a pomalé načítanie brzdili vývoj nových modulov v zdravotníckom prostredí.',
      solution:
        'Znovupoužiteľná komponentová knižnica v React a Next.js s optimalizáciou výkonu o 35 %.',
      features: [
        'Shared UI knižnica — rýchlosť vývoja +25 %',
        'AWS S3 integrácia pre médiá',
        'Cross-browser kompatibilita a CI/CD',
      ],
    },
    licenses: {
      roles: ['Backend Developer'],
      date: 'feb 2022 — jan 2023',
      type: 'ENTERPRISE',
      overview:
        'Enterprise licenčný systém s 50+ REST endpointmi. NestJS, PostgreSQL a AWS deploy pre škálovateľnosť.',
      problem:
        'Chýbajúca centralizácia licencií a nízka spoľahlivosť API pre enterprise klientov.',
      solution:
        'Škálovateľný licenčný backend s 85 % test coverage, monitoringom a role-based prístupom.',
      features: [
        '50+ REST endpointov v NestJS',
        'Role-based access control',
        'AWS deploy a error tracking',
      ],
    },
    'iba-rd': {
      roles: ['React Developer', 'Design Systems'],
      date: 'nov 2025 — súčasnosť',
      type: 'R&D',
      overview:
        'R&D aplikácie pre IBA.CZ — design systém vo Figma, Fluent UI komponenty a SharePoint integrácie.',
      problem:
        'R&D produkty potrebovali konzistentný design systém a rýchlejšiu implementáciu UI naprieč tímom.',
      solution:
        'Návrh komponentov vo Figma a produkčná implementácia vo Fluent UI a SharePoint s TypeScriptom.',
      features: [
        'Design tokeny a komponentová knižnica',
        'SharePoint a Fluent UI integrácie',
        'Prístupné enterprise rozhrania',
      ],
    },
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
    udzs: {
      roles: ['Full-Stack Developer'],
      date: 'Mar 2023 — May 2024',
      type: 'WORK APP',
      overview:
        'Public-sector platform with 500+ active users. I owned the frontend, backend integration, and production deployment.',
      problem:
        'Manual processes and an unstable legacy app slowed down hundreds of users every day.',
      solution:
        'A new React frontend with optimized workflows, Docker deployment, and monitoring for 99.9% uptime.',
      features: [
        'Dashboard for user and role management',
        'Optimized loading and responsive UI',
        'Production monitoring and Docker pipeline',
      ],
    },
    eforms: {
      roles: ['Full-Stack Developer'],
      date: 'Mar 2023 — May 2024',
      type: 'WORK APP',
      overview:
        'Enterprise form processing platform with 1,000+ daily submissions. Full-stack development and workflow optimization.',
      problem:
        'Slow form processing and unclear internal workflows burdened HR and administration teams.',
      solution:
        'React app with TanStack Query, validation, and backend integration — HR processing time −60%.',
      features: [
        'Dynamic forms with validation',
        'Backend API integration and data export',
        '40% faster frontend performance',
      ],
    },
    prolekare: {
      roles: ['Frontend Developer'],
      date: 'Oct 2024 — Jul 2025',
      type: 'HEALTHCARE',
      overview:
        'Frontend for prolekare.cz and internal healthcare apps. Component library and AWS S3 for assets.',
      problem:
        'Inconsistent UI and slow load times blocked development of new modules in a healthcare environment.',
      solution:
        'Reusable component library in React and Next.js with 35% performance improvement.',
      features: [
        'Shared UI library — development speed +25%',
        'AWS S3 integration for media',
        'Cross-browser compatibility and CI/CD',
      ],
    },
    licenses: {
      roles: ['Backend Developer'],
      date: 'Feb 2022 — Jan 2023',
      type: 'ENTERPRISE',
      overview:
        'Enterprise license system with 50+ REST endpoints. NestJS, PostgreSQL, and AWS deployment for scale.',
      problem:
        'Missing license centralization and low API reliability for enterprise clients.',
      solution:
        'Scalable license backend with 85% test coverage, monitoring, and role-based access.',
      features: [
        '50+ REST endpoints in NestJS',
        'Role-based access control',
        'AWS deployment and error tracking',
      ],
    },
    'iba-rd': {
      roles: ['React Developer', 'Design Systems'],
      date: 'Nov 2025 — Present',
      type: 'R&D',
      overview:
        'R&D applications for IBA.CZ — Figma design system, Fluent UI components, and SharePoint integrations.',
      problem:
        'R&D products needed a consistent design system and faster UI implementation across the team.',
      solution:
        'Component design in Figma and production implementation in Fluent UI and SharePoint with TypeScript.',
      features: [
        'Design tokens and component library',
        'SharePoint and Fluent UI integrations',
        'Accessible enterprise interfaces',
      ],
    },
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
    previousProject: 'Predchádzajúci projekt',
    nextProject: 'Ďalší projekt',
    sourceCode: 'Zdrojový kód na GitHub',
    liveDemo: 'Live demo',
    linksTitle: 'Odkazy',
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
    previousProject: 'Previous project',
    nextProject: 'Next project',
    sourceCode: 'Source code on GitHub',
    liveDemo: 'Live demo',
    linksTitle: 'Links',
    dbName: 'Name',
    dbType: 'Type',
    dbStack: 'Stack',
    dbDescription: 'Description',
  },
}

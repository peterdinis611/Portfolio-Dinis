import type { Lang } from '@/i18n/translations'

export const notionPageBlocks: Record<
  Lang,
  {
    about: {
      bioHighlight: string
      quote: string
      approachTitle: string
      approachTodos: Array<{ text: string; done: boolean }>
      workingStyle: Array<{ title: string; body: string }>
      tocTitle: string
      tocItems: Array<{ id: string; label: string }>
      currentlyTitle: string
      currentlyText: string
    }
    tech: {
      tocTitle: string
      quote: string
      principles: Array<{ title: string; body: string }>
    }
    experience: {
      quote: string
      processTitle: string
      processSteps: string[]
      highlightsToggle: Array<{ title: string; body: string }>
    }
    projects: {
      galleryTitle: string
      databaseTitle: string
      viewNote: string
    }
    contact: {
      faqTitle: string
      faq: Array<{ title: string; body: string }>
      bookmarks: Array<{ href: string; title: string; description: string; external: boolean }>
      nextStepsTitle: string
      nextSteps: Array<{ text: string; done: boolean }>
    }
    projectDetail: {
      tocTitle: string
      techNotesTitle: string
      techNotesBody: string
      relatedTitle: string
    }
  }
> = {
  sk: {
    about: {
      bioHighlight: '4+ roky v produkcii · React · TypeScript · design systémy',
      quote:
        'Dobrý produkt nie je len kód — je to jasné UX, spoľahlivá architektúra a tímová spolupráca, ktorá doručí hodnotu používateľom.',
      approachTitle: 'Ako pracujem',
      approachTodos: [
        { text: 'Porozumiem produktu a kontextu tímu', done: true },
        { text: 'Navrhnem riešenie a rozdelím prácu na iterácie', done: true },
        { text: 'Dodám kód s testami a dokumentáciou', done: true },
        { text: 'Mentorujem a zdieľam know-how v tíme', done: false },
      ],
      workingStyle: [
        {
          title: '☀️ Cez deň — produkčný vývoj',
          body: 'React, TypeScript, code review, design systémy a spolupráca s produktom v agile sprintoch.',
        },
        {
          title: '🌙 Večer — experimenty & učenie',
          body: 'Side projekty, nové knižnice, refaktoring a skúšanie nástrojov, ktoré môžem priniesť do tímu.',
        },
        {
          title: '🤝 Spolupráca',
          body: 'Preferujem priamu komunikáciu, krátke iterácie a transparentný postup bez zbytočnej byrokracie.',
        },
      ],
      tocTitle: 'Na tejto stránke',
      tocItems: [
        { id: 'about-facts', label: 'Základné info' },
        { id: 'about-skills', label: 'Schopnosti' },
        { id: 'about-approach', label: 'Ako pracujem' },
      ],
      currentlyTitle: 'Momentálne',
      currentlyText: 'Pracujem na R&D projektoch v IBA.CZ — design systémy, Fluent UI a React aplikácie.',
    },
    tech: {
      tocTitle: 'Obsah',
      quote: 'Stack volím podľa produktu — nie naopak. Dôležitá je udržateľnosť, rýchlosť tímu a kvalita UX.',
      principles: [
        {
          title: '⚛️ Frontend',
          body: 'Komponenty, prístupnosť, výkon a design systémy — React, Next.js, Tailwind, shadcn/ui.',
        },
        {
          title: '🛠️ Backend',
          body: 'REST API, validácia, testy a databázy — NestJS, PostgreSQL, MongoDB.',
        },
        {
          title: '☁️ DevOps',
          body: 'Docker, CI/CD, AWS a monitoring pre stabilné produkčné nasadenia.',
        },
      ],
    },
    experience: {
      quote:
        'Každá rola ma posunula bližšie k tomu, aby som vedel dodávať celé produkty — nie len jednotlivé tasky.',
      processTitle: 'Môj pracovný proces',
      processSteps: [
        'Discovery — pochopenie problému, stakeholderov a obmedzení',
        'Návrh — architektúra, wireframe alebo API kontrakt',
        'Implementácia — iteratívna dodávka s code review',
        'Stabilizácia — testy, monitoring, handover dokumentácia',
      ],
      highlightsToggle: [
        {
          title: '💼 Produkčné skúsenosti',
          body: 'IBA.CZ, Meditorial, JUMP soft a Navisys — healthcare, enterprise, verejný sektor a R&D.',
        },
        {
          title: '📈 Merateľný dopad',
          body: '500+ používateľov, 99,9 % uptime, +25 % rýchlosť vývoja, mentoring 2 juniorov.',
        },
      ],
    },
    projects: {
      galleryTitle: 'Gallery view',
      databaseTitle: 'Table view',
      viewNote: 'Prepínaj medzi galériou a tabuľkou — ako v Notion databáze.',
    },
    contact: {
      faqTitle: 'Často kladené otázky',
      faq: [
        {
          title: 'Aký typ spolupráce hľadáš?',
          body: 'Produktový vývoj, full-stack role alebo konzultácie okolo Reactu, TypeScriptu a design systémov.',
        },
        {
          title: 'Pracuješ na diaľku?',
          body: 'Áno — hybrid alebo remote v rámci ČR/SK. Osobné stretnutie v Prahe je tiež možné.',
        },
        {
          title: 'Ako rýchlo odpovedáš?',
          body: 'Zvyčajne do 24–48 hodín v pracovných dňoch.',
        },
      ],
      bookmarks: [
        {
          href: 'https://github.com/peterdinis',
          title: 'GitHub — Peter Dinis',
          description: 'Open-source a ukážky kódu.',
          external: true,
        },
        {
          href: 'https://linkedin.com/in/peterdinis',
          title: 'LinkedIn — Peter Dinis',
          description: 'Profesný profil a skúsenosti.',
          external: true,
        },
      ],
      nextStepsTitle: 'Ďalšie kroky',
      nextSteps: [
        { text: 'Napíš mi o projekte alebo role', done: false },
        { text: 'Dohodneme krátky call', done: false },
        { text: 'Pošlem relevantné referencie', done: false },
      ],
    },
    projectDetail: {
      tocTitle: 'Obsah case study',
      techNotesTitle: 'Technické poznámky',
      techNotesBody:
        'Kód je štruktúrovaný po feature moduloch, s typovanými API vrstvami a znovupoužiteľnými UI komponentmi.',
      relatedTitle: 'Ďalšie projekty',
    },
  },
  en: {
    about: {
      bioHighlight: '4+ years in production · React · TypeScript · design systems',
      quote:
        'A great product is not just code — it is clear UX, reliable architecture, and teamwork that delivers value to users.',
      approachTitle: 'How I work',
      approachTodos: [
        { text: 'Understand the product and team context', done: true },
        { text: 'Design the solution and split work into iterations', done: true },
        { text: 'Ship code with tests and documentation', done: true },
        { text: 'Mentor and share know-how with the team', done: false },
      ],
      workingStyle: [
        {
          title: '☀️ By day — production development',
          body: 'React, TypeScript, code reviews, design systems, and product collaboration in agile sprints.',
        },
        {
          title: '🌙 By night — experiments & learning',
          body: 'Side projects, new libraries, refactoring, and trying tools I can bring back to the team.',
        },
        {
          title: '🤝 Collaboration',
          body: 'I prefer direct communication, short iterations, and transparent progress without unnecessary bureaucracy.',
        },
      ],
      tocTitle: 'On this page',
      tocItems: [
        { id: 'about-facts', label: 'Basic info' },
        { id: 'about-skills', label: 'Skills' },
        { id: 'about-approach', label: 'How I work' },
      ],
      currentlyTitle: 'Currently',
      currentlyText: 'Working on R&D projects at IBA.CZ — design systems, Fluent UI, and React applications.',
    },
    tech: {
      tocTitle: 'Contents',
      quote: 'I choose the stack based on the product — not the other way around. Sustainability, team speed, and UX quality matter most.',
      principles: [
        {
          title: '⚛️ Frontend',
          body: 'Components, accessibility, performance, and design systems — React, Next.js, Tailwind, shadcn/ui.',
        },
        {
          title: '🛠️ Backend',
          body: 'REST APIs, validation, tests, and databases — NestJS, PostgreSQL, MongoDB.',
        },
        {
          title: '☁️ DevOps',
          body: 'Docker, CI/CD, AWS, and monitoring for stable production deployments.',
        },
      ],
    },
    experience: {
      quote:
        'Every role moved me closer to delivering whole products — not just isolated tasks.',
      processTitle: 'My work process',
      processSteps: [
        'Discovery — understand the problem, stakeholders, and constraints',
        'Design — architecture, wireframes, or API contract',
        'Implementation — iterative delivery with code review',
        'Stabilization — tests, monitoring, handover documentation',
      ],
      highlightsToggle: [
        {
          title: '💼 Production experience',
          body: 'IBA.CZ, Meditorial, JUMP soft, and Navisys — healthcare, enterprise, public sector, and R&D.',
        },
        {
          title: '📈 Measurable impact',
          body: '500+ users, 99.9% uptime, +25% dev speed, mentored 2 juniors.',
        },
      ],
    },
    projects: {
      galleryTitle: 'Gallery view',
      databaseTitle: 'Table view',
      viewNote: 'Switch between gallery and table — like a Notion database.',
    },
    contact: {
      faqTitle: 'Frequently asked questions',
      faq: [
        {
          title: 'What type of collaboration are you looking for?',
          body: 'Product development, full-stack roles, or consulting around React, TypeScript, and design systems.',
        },
        {
          title: 'Do you work remotely?',
          body: 'Yes — hybrid or remote within CZ/SK. In-person meetings in Prague are also possible.',
        },
        {
          title: 'How fast do you reply?',
          body: 'Usually within 24–48 hours on business days.',
        },
      ],
      bookmarks: [
        {
          href: 'https://github.com/peterdinis',
          title: 'GitHub — Peter Dinis',
          description: 'Open source and code samples.',
          external: true,
        },
        {
          href: 'https://linkedin.com/in/peterdinis',
          title: 'LinkedIn — Peter Dinis',
          description: 'Professional profile and experience.',
          external: true,
        },
      ],
      nextStepsTitle: 'Next steps',
      nextSteps: [
        { text: 'Send me a note about your project or role', done: false },
        { text: 'We schedule a short call', done: false },
        { text: 'I share relevant references', done: false },
      ],
    },
    projectDetail: {
      tocTitle: 'Case study contents',
      techNotesTitle: 'Technical notes',
      techNotesBody:
        'Code is structured by feature modules, with typed API layers and reusable UI components.',
      relatedTitle: 'More projects',
    },
  },
}

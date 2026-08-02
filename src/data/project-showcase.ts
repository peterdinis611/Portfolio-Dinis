import type { Lang } from '@/i18n/translations'
import type { ProjectIconTone } from '@/data/portfolio-meta'

export type ProjectMetric = {
  value: string
  label: Record<Lang, string>
}

export type LocalizedText = Record<Lang, string>

export type ProductPreviewVariant =
  | 'dashboard'
  | 'forms'
  | 'healthcare'
  | 'api'
  | 'licenses'
  | 'design-system'
  | 'notebooks'
  | 'notes'
  | 'canvas'
  | 'library'

export type ProjectDemo = {
  type: 'live' | 'repo'
  url: string
}

export type RoleOutcome = {
  role: LocalizedText
  outcome: LocalizedText
}

export type FlowStep = LocalizedText

export type BeforeAfter = {
  before: LocalizedText
  after: LocalizedText
}

export type ProjectShowcase = {
  metrics: ProjectMetric[]
  preview: ProductPreviewVariant
  previewSecondary?: ProductPreviewVariant
  tone: ProjectIconTone
  /** Company / NDA-bound work — no real product UI */
  anonymized?: boolean
  demo?: ProjectDemo
  rolesOutcomes?: RoleOutcome[]
  architecture?: FlowStep[]
  beforeAfter?: BeforeAfter
}

const companyProof = {
  udzs: {
    rolesOutcomes: [
      {
        role: { sk: 'Frontend ownership', en: 'Frontend ownership' },
        outcome: {
          sk: 'Nový React FE pre 500+ používateľov v produkcii',
          en: 'New React FE shipped for 500+ production users',
        },
      },
      {
        role: { sk: 'Integrácia & deploy', en: 'Integration & deploy' },
        outcome: {
          sk: 'Stabilný Docker pipeline a monitoring (99,9 % uptime)',
          en: 'Stable Docker pipeline and monitoring (99.9% uptime)',
        },
      },
    ],
    architecture: [
      { sk: 'UI vrstva (React)', en: 'UI layer (React)' },
      { sk: 'API / backend služby', en: 'API / backend services' },
      { sk: 'PostgreSQL', en: 'PostgreSQL' },
      { sk: 'Docker + monitoring', en: 'Docker + monitoring' },
    ],
    beforeAfter: {
      before: {
        sk: 'Manuálne procesy, nestabilná legacy app, pomalé denné workflow',
        en: 'Manual processes, unstable legacy app, slow daily workflows',
      },
      after: {
        sk: 'Optimalizovaný FE workflow, spoľahlivý deploy, merateľný uptime',
        en: 'Optimized FE workflows, reliable deploy, measurable uptime',
      },
    },
  },
  eforms: {
    rolesOutcomes: [
      {
        role: { sk: 'Full-stack delivery', en: 'Full-stack delivery' },
        outcome: {
          sk: 'Form platforma s 1k+ dennými odoslaniami',
          en: 'Form platform handling 1k+ daily submissions',
        },
      },
      {
        role: { sk: 'Workflow optimalizácia', en: 'Workflow optimization' },
        outcome: {
          sk: 'HR procesy kratšie o ~60 %, FE rýchlejší o ~40 %',
          en: 'HR processes ~60% faster, FE ~40% quicker',
        },
      },
    ],
    architecture: [
      { sk: 'React formuláre', en: 'React forms' },
      { sk: 'TanStack Query cache', en: 'TanStack Query cache' },
      { sk: 'Backend API', en: 'Backend API' },
      { sk: 'Export / reporting', en: 'Export / reporting' },
    ],
    beforeAfter: {
      before: {
        sk: 'Pomalé spracovanie, neprehľadné interné kroky pre HR',
        en: 'Slow processing, unclear internal steps for HR',
      },
      after: {
        sk: 'Validované dynamické formuláre a kratší administratívny cyklus',
        en: 'Validated dynamic forms and a shorter admin cycle',
      },
    },
  },
  prolekare: {
    rolesOutcomes: [
      {
        role: { sk: 'Frontend / design system', en: 'Frontend / design system' },
        outcome: {
          sk: 'Shared UI knižnica — vývoj modulov +25 %',
          en: 'Shared UI library — module delivery +25%',
        },
      },
      {
        role: { sk: 'Performance', en: 'Performance' },
        outcome: {
          sk: 'Optimalizácia UI o ~35 % v healthcare kontexte',
          en: '~35% UI performance gains in a healthcare context',
        },
      },
    ],
    architecture: [
      { sk: 'Next.js / React apps', en: 'Next.js / React apps' },
      { sk: 'Shared component library', en: 'Shared component library' },
      { sk: 'AWS S3 assets', en: 'AWS S3 assets' },
      { sk: 'CI/CD checks', en: 'CI/CD checks' },
    ],
    beforeAfter: {
      before: {
        sk: 'Nekonzistentné UI a pomalé načítanie brzdili nové moduly',
        en: 'Inconsistent UI and slow loads blocked new modules',
      },
      after: {
        sk: 'Znovupoužiteľné komponenty, rýchlejší FE a stabilnejší delivery',
        en: 'Reusable components, faster FE, steadier delivery',
      },
    },
  },
  licenses: {
    rolesOutcomes: [
      {
        role: { sk: 'Backend architecture', en: 'Backend architecture' },
        outcome: {
          sk: '50+ REST endpointov a škálovateľný licenčný model',
          en: '50+ REST endpoints and a scalable license model',
        },
      },
      {
        role: { sk: 'Quality & security', en: 'Quality & security' },
        outcome: {
          sk: '85 % test coverage, RBAC a AWS monitoring',
          en: '85% test coverage, RBAC, and AWS monitoring',
        },
      },
    ],
    architecture: [
      { sk: 'NestJS API', en: 'NestJS API' },
      { sk: 'PostgreSQL', en: 'PostgreSQL' },
      { sk: 'RBAC vrstva', en: 'RBAC layer' },
      { sk: 'AWS deploy', en: 'AWS deploy' },
    ],
    beforeAfter: {
      before: {
        sk: 'Chýbajúca centralizácia licencií a nízka spoľahlivosť API',
        en: 'Missing license centralization and low API reliability',
      },
      after: {
        sk: 'Jednotný licenčný backend s rolami, testami a trackingom',
        en: 'Unified license backend with roles, tests, and tracking',
      },
    },
  },
  'iba-rd': {
    rolesOutcomes: [
      {
        role: { sk: 'Design systems', en: 'Design systems' },
        outcome: {
          sk: 'Tokeny a komponenty napojené na Fluent UI / SharePoint',
          en: 'Tokens and components wired into Fluent UI / SharePoint',
        },
      },
      {
        role: { sk: 'R&D delivery', en: 'R&D delivery' },
        outcome: {
          sk: 'Rýchlejšia UI implementácia naprieč R&D produktmi',
          en: 'Faster UI implementation across R&D products',
        },
      },
    ],
    architecture: [
      { sk: 'Figma design tokens', en: 'Figma design tokens' },
      { sk: 'Fluent UI kit', en: 'Fluent UI kit' },
      { sk: 'React apps', en: 'React apps' },
      { sk: 'SharePoint integrácie', en: 'SharePoint integrations' },
    ],
    beforeAfter: {
      before: {
        sk: 'Rozdrobené UI rozhodnutia naprieč R&D tímom',
        en: 'Fragmented UI decisions across the R&D team',
      },
      after: {
        sk: 'Zdieľaný design systém a konzistentné enterprise rozhrania',
        en: 'Shared design system and consistent enterprise interfaces',
      },
    },
  },
}

export const projectShowcase: Record<string, ProjectShowcase> = {
  udzs: {
    tone: 'blue',
    anonymized: true,
    preview: 'dashboard',
    previewSecondary: 'api',
    metrics: [
      { value: '500+', label: { sk: 'aktívnych používateľov', en: 'active users' } },
      { value: '99.9%', label: { sk: 'uptime', en: 'uptime' } },
      { value: 'FE', label: { sk: 'produkčný ownership', en: 'production ownership' } },
    ],
    ...companyProof.udzs,
  },
  eforms: {
    tone: 'orange',
    anonymized: true,
    preview: 'forms',
    previewSecondary: 'dashboard',
    metrics: [
      { value: '1k+', label: { sk: 'odoslaní denne', en: 'submissions / day' } },
      { value: '−60%', label: { sk: 'čas HR procesov', en: 'HR process time' } },
      { value: '+40%', label: { sk: 'rýchlosť FE', en: 'frontend speed' } },
    ],
    ...companyProof.eforms,
  },
  prolekare: {
    tone: 'pink',
    anonymized: true,
    preview: 'healthcare',
    previewSecondary: 'design-system',
    metrics: [
      { value: '+35%', label: { sk: 'výkon UI', en: 'UI performance' } },
      { value: '+25%', label: { sk: 'rýchlosť vývoja', en: 'dev velocity' } },
      { value: 'UI', label: { sk: 'shared knižnica', en: 'shared library' } },
    ],
    ...companyProof.prolekare,
  },
  licenses: {
    tone: 'purple',
    anonymized: true,
    preview: 'licenses',
    previewSecondary: 'api',
    metrics: [
      { value: '50+', label: { sk: 'REST endpointov', en: 'REST endpoints' } },
      { value: '85%', label: { sk: 'test coverage', en: 'test coverage' } },
      { value: 'RBAC', label: { sk: 'prístupové role', en: 'access control' } },
    ],
    ...companyProof.licenses,
  },
  'iba-rd': {
    tone: 'green',
    anonymized: true,
    preview: 'design-system',
    previewSecondary: 'dashboard',
    metrics: [
      { value: 'DS', label: { sk: 'design systém', en: 'design system' } },
      { value: 'UI', label: { sk: 'Fluent komponenty', en: 'Fluent components' } },
      { value: 'R&D', label: { sk: 'produktové apps', en: 'product apps' } },
    ],
    ...companyProof['iba-rd'],
  },
  'docu-nest': {
    tone: 'blue',
    preview: 'notebooks',
    previewSecondary: 'dashboard',
    demo: { type: 'repo', url: 'https://github.com/peterdinis611/Docu-Nest' },
    metrics: [
      { value: 'AI', label: { sk: 'notebook workflow', en: 'notebook workflow' } },
      { value: 'XState', label: { sk: 'stavové stroje', en: 'state machines' } },
      { value: 'SQLite', label: { sk: 'lokálne dáta', en: 'local data' } },
    ],
  },
  'scribe-notes': {
    tone: 'yellow',
    preview: 'notes',
    previewSecondary: 'notebooks',
    demo: { type: 'repo', url: 'https://github.com/peterdinis611/Scribe-Notes-App' },
    metrics: [
      { value: 'Tauri', label: { sk: 'natívny desktop', en: 'native desktop' } },
      { value: 'FTS5', label: { sk: 'fulltext search', en: 'full-text search' } },
      { value: 'Offline', label: { sk: 'lokálne SQLite', en: 'local SQLite' } },
    ],
  },
  'boom-scope': {
    tone: 'purple',
    preview: 'canvas',
    previewSecondary: 'notes',
    demo: { type: 'live', url: 'https://boom-scope.vercel.app' },
    metrics: [
      { value: 'AI', label: { sk: 'design generátor', en: 'design generator' } },
      { value: 'Live', label: { sk: 'Convex real-time', en: 'Convex real-time' } },
      { value: '1', label: { sk: 'workspace app', en: 'workspace app' } },
    ],
  },
  'pulse-apiclient': {
    tone: 'orange',
    preview: 'api',
    previewSecondary: 'dashboard',
    demo: { type: 'repo', url: 'https://github.com/peterdinis611/Pulse-ApiClient' },
    metrics: [
      { value: 'Rust', label: { sk: 'HTTP engine', en: 'HTTP engine' } },
      { value: 'WS', label: { sk: 'WebSocket klient', en: 'WebSocket client' } },
      { value: 'Tauri', label: { sk: 'desktop runtime', en: 'desktop runtime' } },
    ],
  },
  'spst-kniznica': {
    tone: 'green',
    preview: 'library',
    previewSecondary: 'dashboard',
    demo: { type: 'live', url: 'https://spst-kniznica.vercel.app' },
    metrics: [
      { value: 'Full', label: { sk: 'katalóg + admin', en: 'catalog + admin' } },
      { value: 'Auth', label: { sk: 'Auth.js sessions', en: 'Auth.js sessions' } },
      { value: 'SQL', label: { sk: 'atomické výpožičky', en: 'atomic loans' } },
    ],
  },
}

export function getProjectShowcase(projectId: string): ProjectShowcase | undefined {
  return projectShowcase[projectId]
}

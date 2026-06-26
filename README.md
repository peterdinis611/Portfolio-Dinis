# Peter Dinis — Notion Portfolio

Interactive portfolio with a Notion-like layout: sidebar navigation, document pages, hash URLs, SK/EN language toggle, and light/dark theme. Content can be authored in React or synced from real Notion pages via [react-notion-x](https://github.com/NotionX/react-notion-x).

## Stack

| Layer | Tools |
|-------|--------|
| UI | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS v4, shadcn/ui (Radix primitives) |
| Notion rendering | react-notion-x, notion-client |
| Motion | Framer Motion |
| State | XState (`@xstate/react`) |
| Icons | [simple-icons](https://simpleicons.org/) + Lucide |
| Quality | Biome (lint + format) |

## Getting started

**Requirements:** Node.js 20+

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

## How to use

| Input | Action |
|-------|--------|
| Sidebar links | Navigate between pages (`#about`, `#tech`, …) |
| Search | Filter pages in the sidebar |
| Header controls | Switch SK / EN and light / dark theme |
| Mobile menu | Open sidebar sheet |

Language and theme preferences are stored in `localStorage` (`portfolio-lang`, `portfolio-theme`).

## Pages

| Page | Content |
|------|---------|
| About | Bio, interests, services |
| Technologies | Stack (frontend, backend, cloud, mobile) |
| Experience | Job history with collapsible roles |
| Projects | Selected work with descriptions |
| Contact | Email, phone, location, social links |

## Notion sync (optional)

By default, pages are rendered from React components in `src/components/notion/pages/`. To render content from real Notion pages instead, sync record maps at build time:

```bash
# Set page IDs (and optional auth for private workspaces)
export NOTION_PAGE_ABOUT="your-page-id"
export NOTION_PAGE_TECH="your-page-id"
# … experience, projects, contact

# Optional — private pages
export NOTION_TOKEN_V2="your-notion-token"
export NOTION_ACTIVE_USER="your-active-user-id"

npm run notion:sync
```

Synced JSON files are written to `src/data/notion/recordmaps/`. When a file exists for a page, the app uses `NotionRenderer` instead of the fallback React page.

## Project structure

```
src/
├── components/notion/   # Shell, pages, react-notion-x renderer
├── components/ui/     # shadcn/ui primitives
├── context/             # XState providers
├── data/                # portfolio.ts, technologies.ts, notion/recordmaps/
├── i18n/translations.ts # SK / EN copy
├── lib/                 # utils, SEO, notion record map loader
├── machines/            # settingsMachine
└── index.css            # Tailwind + shadcn theme tokens
```

## Customize content

| What | Where |
|------|--------|
| Profile, projects, socials | `src/data/portfolio.ts` |
| Tech stack | `src/data/technologies.ts` |
| All UI copy (SK / EN) | `src/i18n/translations.ts` |
| Page components | `src/components/notion/pages/` |
| Sidebar / nav | `src/components/notion/nav.ts` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run notion:sync` | Fetch Notion pages → JSON record maps |
| `npm run verify` | `tsc` + Biome CI |

## SEO

The app updates meta tags, Open Graph, Twitter cards, canonical URLs and JSON-LD when the language changes.

Before deploy, set your production URL:

```bash
VITE_SITE_URL=https://your-domain.com
```

Also update `<loc>` in `public/sitemap.xml` and `Sitemap:` in `public/robots.txt` to match.

## License

Private project — Peter Dinis © 2026

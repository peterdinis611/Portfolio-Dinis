# Peter Dinis — Obsidian Portfolio

Interactive portfolio with an Obsidian-like layout: vault sidebar, markdown-style pages, hash URLs, SK/EN language toggle, and light/dark theme. Content is authored in React; optional sync from Notion pages via [react-notion-x](https://github.com/NotionX/react-notion-x).

## Stack

| Layer | Tools |
|-------|--------|
| UI | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS v4, shadcn/ui (Radix primitives) |
| Synced pages | react-notion-x, notion-client |
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

## Vault sync (optional)

By default, pages are rendered from React components in `src/components/obsidian/pages/`. To render content from synced Notion pages instead, sync record maps at build time:

```bash
# Set page IDs (and optional auth for private workspaces)
export NOTION_PAGE_ABOUT="your-page-id"
export NOTION_PAGE_TECH="your-page-id"
# … experience, projects, contact

# Optional — private pages
export NOTION_TOKEN_V2="your-notion-token"
export NOTION_ACTIVE_USER="your-active-user-id"

npm run obsidian:sync
```

Synced JSON files are written to `src/data/obsidian/recordmaps/`. When a file exists for a page, the app uses the synced renderer instead of the fallback React page.

## Project structure

```
src/
├── components/obsidian/   # Shell, pages, synced renderer
├── components/ui/         # shadcn/ui primitives
├── context/               # XState providers
├── data/                  # portfolio.ts, technologies.ts, obsidian/recordmaps/
├── i18n/translations.ts   # SK / EN copy
├── lib/                   # utils, SEO, obsidian record map loader
├── machines/              # settingsMachine
└── index.css              # Tailwind + theme tokens
```

## Customize content

| What | Where |
|------|--------|
| Profile, projects, socials | `src/data/portfolio.ts` |
| Tech stack | `src/data/technologies.ts` |
| All UI copy (SK / EN) | `src/i18n/translations.ts` |
| Page components | `src/components/obsidian/pages/` |
| Sidebar / nav | `src/components/obsidian/nav.ts` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run obsidian:sync` | Fetch Notion pages → JSON record maps |
| `npm run verify` | `tsc` + Biome CI |

## SEO

Meta tags, Open Graph, Twitter cards, canonical URLs, breadcrumbs JSON-LD and `Person` / `ProfilePage` schema update when **language** or **page** (`#about`, `#tech`, …) changes.

| File | Purpose |
|------|---------|
| `index.html` | Default SK meta (crawlers without JS) |
| `src/lib/seo.ts` | Dynamic SEO per page + language |
| `src/components/SeoManager.tsx` | Syncs SEO on navigation |
| `public/robots.txt` | Crawler rules |
| `public/sitemap.xml` | All portfolio sections |
| `public/og-image.jpg` | Social preview image |

### Deploy setup

```bash
cp .env.example .env
# Set your production domain:
# VITE_SITE_URL=https://your-domain.com
```

Regenerate `robots.txt` and `sitemap.xml` from `.env`:

```bash
npm run seo:generate
```

`npm run build` runs this automatically before the Vite build.

## License

Private project — Peter Dinis © 2026

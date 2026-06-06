# Peter Dinis — Book Portfolio

Interactive portfolio presented as a digital book. Open the cover, flip through chapters, and explore profile, tech stack, experience, projects, and contact — in Slovak or English, with light and dark themes.

## Stack

| Layer | Tools |
|-------|--------|
| UI | React 19, TypeScript, Vite 8 |
| Motion | Framer Motion |
| State | XState (`@xstate/react`) |
| Components | Chakra UI v3 (optional; existing styles use CSS) |
| Icons | [simple-icons](https://simpleicons.org/) + custom brand SVGs |
| Quality | Biome (lint + format), ESLint (React hooks) |

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
| `Enter` / click cover | Open or close the book |
| `←` `→` / toolbar | Previous / next spread |
| Click page edge | Turn page |
| `Esc` | Close book |
| Header controls | Switch SK / EN and light / dark theme |

Language and theme preferences are stored in `localStorage` (`portfolio-lang`, `portfolio-theme`).

## Chapters

| Chapter | Content |
|---------|---------|
| About | Bio, interests, services |
| Technologies | Stack split across multiple pages (frontend, backend, cloud, mobile) |
| Experience | Job history from CV (2 roles per page) |
| Projects | Selected work with descriptions |
| Contact | Email, phone, location, social links |
| Epilogue | Closing message and mailto CTA |

## Project structure

```
src/
├── components/book/     # Book UI (pages, spreads, finale, tech grid)
├── context/             # XState providers + Chakra
├── data/                # portfolio.ts, technologies.ts
├── i18n/translations.ts # SK / EN copy
├── lib/                 # Brand icons, preload helpers
├── machines/            # bookMachine, settingsMachine
├── styles/              # book.css, preload.css
└── theme/               # Chakra system (no CSS reset — keeps book styles)
```

## Customize content

| What | Where |
|------|--------|
| Profile, projects, socials | `src/data/portfolio.ts` |
| Tech stack & book page splits | `src/data/technologies.ts` |
| All UI copy (SK / EN) | `src/i18n/translations.ts` |
| Page layout & chapter order | `src/components/book/pages.tsx` |
| Book styling | `src/styles/book.css` |

## Scripts

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |

### Code quality

| Command | Description |
|---------|-------------|
| `npm run check` | Biome — lint, format, imports (read-only) |
| `npm run check:fix` | Biome — apply safe fixes |
| `npm run check:staged` | Biome — staged files only (git hooks) |
| `npm run format` | Format all files |
| `npm run format:check` | Check formatting |
| `npm run lint` | ESLint |
| `npm run lint:eslint` | ESLint (alias) |
| `npm run lint:biome` | Biome lint only |
| `npm run lint:biome:fix` | Biome lint + fix |
| `npm run biome:ci` | Strict Biome check for CI |
| `npm run verify` | `tsc` + Biome CI + ESLint |

## Editor setup

Install the [Biome VS Code extension](https://biomejs.dev/guides/editors/first-party-extensions/) and set Biome as the default formatter for best results with `biome.json`.

## License

Private project — Peter Dinis © 2026

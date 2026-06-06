# Pixel Journey

Arcade **platformer portfolio** — jump through four levels, collect portfolio items, and reach the exit portal to advance.

## Stack

- React 19 + TypeScript + Vite
- Three.js + React Three Fiber + Drei
- Zustand (game state & progress)

## Getting started

```bash
npm install
npm run dev
```

## How to play

| Input | Action |
|-------|--------|
| `←` `→` / `A` `D` | Move |
| `Space` / `W` / `↑` | Jump |
| Touch stars | Open portfolio panels |
| Collect all ★, enter portal | Complete level |
| Level dots (top) | Switch unlocked levels |

Progress is saved in `localStorage` (`pixelJourneyProgress`).

## Levels

| # | Theme | Portfolio section |
|---|--------|-------------------|
| 1 | Village Dawn | About |
| 2 | Neon District | Projects |
| 3 | Rune Forest | Experience |
| 4 | Sunset Shore | Contact & socials |

## Customize

- **Content:** `src/data/portfolio.ts`
- **Level layouts:** `src/game/levels/level1.ts` … `level4.ts`
- **Physics tuning:** `src/game/constants.ts`

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm run preview` — preview build

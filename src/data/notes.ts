import type { NoteBlock, NoteCoverId } from '@/lib/note-blocks'
import { flattenNoteBody } from '@/lib/note-blocks'
import { countWords, estimateReadingMinutes } from '@/lib/search-utils'
import { type NoteDraft, upgradeBody } from './upgrade-note-body'

export type Note = {
  id: string
  icon: string
  date: string
  /** Synced from body word count (~220 wpm). */
  readingMinutes: number
  wordCount: number
  tags: string[]
  title: { sk: string; en: string }
  summary: { sk: string; en: string }
  body: { sk: NoteBlock[]; en: NoteBlock[] }
  featured?: boolean
  cover?: NoteCoverId
  accent?: string
}

const notesSource: NoteDraft[] = [
  {
    id: 'design-systems',
    icon: '🎨',
    date: '2026-03-12',
    readingMinutes: 8,
    featured: true,
    cover: 'boom-scope',
    accent: '#18747a',
    tags: ['Design systems', 'React', 'Fluent UI'],
    title: {
      sk: 'Design systém, ktorý tím skutočne používa',
      en: 'A design system the team actually ships with',
    },
    summary: {
      sk: 'Tokeny, dokumentácia a code review — čo oddelí knižnicu komponentov od mŕtvej dokumentácie.',
      en: 'Tokens, docs, and code review — what separates a component library from dead documentation.',
    },
    outline: {
      sk: ['Most do produkcie', 'Tokeny a kontrakt', 'Ako merať úspech'],
      en: ['Bridge into production', 'Tokens and contract', 'How to measure success'],
    },
    extras: {
      sk: {
        list: [
          'Design tokeny ako single source of truth',
          'Storybook ako živý kontrakt',
          'Code review, ktoré odmietne one-off štýly',
        ],
        callout:
          'Začni malým: tokeny + 5–8 komponentov + Storybook + lint pravidlo. Veľký „DS v1“ launch často zomrie ako dokumentácia.',
      },
      en: {
        list: [
          'Design tokens as the single source of truth',
          'Storybook as a living contract',
          'Code review that rejects one-off styles',
        ],
        callout:
          'Start small: tokens + 5–8 components + Storybook + a lint rule. A big “DS v1” launch often dies as unused docs.',
      },
    },
    body: {
      sk: [
        'Najväčšia chyba pri design systémoch nie je zlá Figma — je to chýbajúci most do produkčného kódu. Ak tokeny a komponenty nie sú ten istý zdroj pravdy, tím ich obchádza. Vzniknú „lokálne“ buttony, hardcodované farby a o pol roka máš dve UI reality: dizajn a produkciu.',
        'V praxi mi funguje trojica: design tokeny ako single source of truth, Storybook ako živý kontrakt a code review, ktoré odmietne one-off štýly mimo systému. Tokeny nie sú len farby — spacing, radius, elevation a typografia musia ísť rovnakou cestou. Keď ich frontend aj Figma čítajú z jedného miesta, drift sa spomalí.',
        'Fluent UI a SharePoint to ešte zosilnia. Enterprise UX má pravidlá prístupnosti, hustoty a konzistencie. Design systém ich musí rešpektovať, inak sa stane „pekne vyzerajúcou knižnicou“, ktorú produktový tím obchádza pod tlakom deadlineov.',
        'Dokumentácia musí byť pri komponente, nie v samostatnom Confluence, ktoré nikto neotvorí. Props, stavy, do’s/don’ts a príklad použitia v reálnom layoute. Ak developer potrebuje 10 minút, aby pochopil `Button`, systém prehral ešte pred merge.',
        'Meradlo úspechu nie je počet komponentov v knižnici. Je to rýchlosť feature worku bez vizuálneho driftu, počet PR, ktoré systém znovupoužijú namiesto kopírovania, a či junior vie dodať obrazovku bez pýtania sa „ktorú sivú máme použiť?“.',
        'Ak buduješ design systém v produkčnom tíme, začni malým: tokeny + 5–8 najpoužívanejších komponentov + Storybook + lint/review pravidlo. Až potom rozširuj. Veľký launch „kompletný DS v1“ často skončí ako mŕtva dokumentácia.',
      ],
      en: [
        'The biggest design-system failure isn’t a bad Figma file — it’s a missing bridge into production code. If tokens and components aren’t one source of truth, teams route around them. You get local buttons, hardcoded colors, and six months later two UI realities: design and production.',
        'What works in practice is a triad: design tokens as the single source of truth, Storybook as a living contract, and code review that rejects one-off styles outside the system. Tokens aren’t just colors — spacing, radius, elevation, and type need the same path. When frontend and Figma read from one place, drift slows down.',
        'Fluent UI and SharePoint amplify this. Enterprise UX has accessibility, density, and consistency rules. The system must respect them, or it becomes a pretty library product teams skip under deadline pressure.',
        'Docs must live next to the component — not in a Confluence page nobody opens. Props, states, do’s/don’ts, and a real layout example. If a developer needs ten minutes to understand `Button`, the system already lost before merge.',
        'Success isn’t component count. It’s feature velocity without visual drift, PRs that reuse the system instead of copying styles, and whether a junior can ship a screen without asking “which gray do we use?”',
        'If you’re building a design system in a production team, start small: tokens + 5–8 highest-use components + Storybook + a lint/review rule. Expand later. A big “complete DS v1” launch often dies as unused documentation.',
      ],
    },
  },
  {
    id: 'xstate-ui',
    icon: '⚙️',
    date: '2026-03-01',
    readingMinutes: 7,
    cover: 'pulse-apiclient',
    accent: '#6940a5',
    tags: ['XState', 'React', 'Architecture'],
    title: {
      sk: 'XState pre UI, ktoré má stavy — nie len boolean flagy',
      en: 'XState for UI with real states — not just boolean flags',
    },
    summary: {
      sk: 'Keď loading/error/success nestačí a flow má vetvy, machine ušetrí mesiac debugovania.',
      en: 'When loading/error/success isn’t enough and the flow has branches, a machine saves a month of debugging.',
    },
    outline: {
      sk: ['Boolean hell', 'Prečo statecharts', 'Kedy áno / nie'],
      en: ['Boolean hell', 'Why statecharts', 'When yes / no'],
    },
    extras: {
      sk: {
        code: {
          lang: 'ts',
          code: `// Idle → submitting → success | failure → retry
createMachine({
  id: 'submit',
  initial: 'idle',
  states: {
    idle: { on: { SUBMIT: 'submitting' } },
    submitting: {
      on: { SUCCESS: 'success', FAILURE: 'failure' },
    },
    success: { type: 'final' },
    failure: { on: { RETRY: 'submitting' } },
  },
})`,
        },
        callout:
          'Viac ako tri súvisiace booleany alebo async flow s retry/cancel → zváž machine. Jeden toggle? Stačí useState.',
      },
      en: {
        code: {
          lang: 'ts',
          code: `// Idle → submitting → success | failure → retry
createMachine({
  id: 'submit',
  initial: 'idle',
  states: {
    idle: { on: { SUBMIT: 'submitting' } },
    submitting: {
      on: { SUCCESS: 'success', FAILURE: 'failure' },
    },
    success: { type: 'final' },
    failure: { on: { RETRY: 'submitting' } },
  },
})`,
        },
        callout:
          'More than three related booleans, or async retry/cancel — consider a machine. One toggle? useState is fine.',
      },
    },
    body: {
      sk: [
        'Boolean hell pozná každý: `isOpen`, `isLoading`, `hasError`, `step === 3`. Po treťom PR už nikto nevie, ktoré kombinácie sú platné. Bug sa prejaví ako „nejde kliknúť Submit po retry“ — a root cause je neplatný stavový priestor.',
        'XState (a statecharts všeobecne) núti pomenovať stavy a prechody. Idle → submitting → success | failure → retry. Nie je to overengineering pre modal s jedným tlačidlom. Je to poistka pre auth flow, multi-step formuláre, sync deskotop appky alebo settings machine v portfóliu.',
        'V Pulse API Client a v tomto portfóliu mi machine pomáha oddeliť „čo používateľ vidí“ od „aké akcie sú dovolené“. UI len číta snapshot a posiela eventy. Testuješ machine bez Reactu — a React komponenty ostanú tenké.',
        'Trade-off: learning curve a viac boilerplate na začiatku. Ak tím ešte bojuje s useEffect, začni jedným kritickým flowom (login, upload, checkout). Keď uvidia, že edge casey zmizli z issue trackeru, adopcia príde sama.',
        'Pravidlo: ak máš viac ako tri booleany, ktoré spolu súvisia, alebo async flow s retry/cancel, zváž machine. Ak máš jeden toggle, stačí useState. Nástroj má sedieť na zložitosť — nie na CV.',
      ],
      en: [
        'Everyone knows boolean hell: `isOpen`, `isLoading`, `hasError`, `step === 3`. After the third PR nobody knows which combinations are valid. The bug shows up as “can’t click Submit after retry” — root cause is an illegal state space.',
        'XState (and statecharts in general) forces named states and transitions. Idle → submitting → success | failure → retry. That isn’t overengineering for a one-button modal. It’s insurance for auth flows, multi-step forms, desktop sync, or a settings machine in a portfolio.',
        'In Pulse API Client and this portfolio, a machine helps separate “what the user sees” from “which actions are allowed.” UI reads the snapshot and sends events. You test the machine without React — and React components stay thin.',
        'Trade-off: learning curve and more boilerplate up front. If the team still struggles with useEffect, start with one critical flow (login, upload, checkout). When edge cases disappear from the tracker, adoption follows.',
        'Rule of thumb: more than three related booleans, or an async flow with retry/cancel — consider a machine. One toggle? useState is fine. The tool should match complexity — not pad a résumé.',
      ],
    },
  },
  {
    id: 'tauri-desktop',
    icon: '🖥️',
    date: '2026-02-04',
    readingMinutes: 9,
    cover: 'scribe-notes',
    accent: '#0f7b6c',
    outline: {
      sk: ['Prečo nie Electron', 'Hranica UI / Rust', 'Kedy Tauri áno'],
      en: ['Why not Electron', 'UI / Rust boundary', 'When Tauri wins'],
    },
    extras: {
      sk: {
        callout:
          'Ak produkt „má byť browser tab“, zostaň na webe. Ak má žiť na disku — Tauri je silná voľba.',
      },
      en: {
        callout:
          'If the product “should be a browser tab,” stay on the web. If it lives on disk — Tauri is a strong bet.',
      },
    },
    tags: ['Tauri', 'Rust', 'Desktop'],
    title: {
      sk: 'Prečo Tauri na desktop nástroje',
      en: 'Why Tauri for desktop tooling',
    },
    summary: {
      sk: 'Web stack + natívny shell — keď Postman-like klient alebo notes app nemajú byť Electron monštrum.',
      en: 'Web stack + native shell — when a Postman-like client or notes app shouldn’t be an Electron monster.',
    },
    body: {
      sk: [
        'Pri Scribe Notes a Pulse API Client som potreboval desktop UX s prístupom k súborom a lokálnemu SQLite — bez 200 MB Electron runtime. Používateľ očakáva rýchly štart, malý inštalátor a pocit natívnej appky, nie „Chrome v okne“.',
        'Tauri drží UI v React + TypeScript a citlivé časti (filesystem, HTTP, šifrovanie, OS dialógy) v Rust commandoch. Hranica je jasná: UI renderuje a zbiera intent, Rust vykonáva privilégované operácie. To znižuje plochu chýb a uľahčuje review.',
        'Pre notes appku to znamená lokálny SQLite, strom súborov a editor (TipTap) v webovom stacku, ktorý už poznám. Pre API klienta kolekcie, históriu requestov a bezpečné uloženie secretov bližšie k OS — nie v localStorage ako v bežnom SPA.',
        'Trade-offy sú reálne: debugging cez WebView, platformové quirkov (macOS vs Windows), a občas treba napísať viac glue kódu v Ruste, než by Electron „urobil za teba“. Ak tím nevie alebo nechce sa učiť Rust aspoň na úrovni commandov, tempo klesne.',
        'Kedy Tauri áno: lokálne nástroje, offline-first produkty, appky kde veľkosť binary a štartovacia rýchlosť sú súčasťou UX. Kedy nie: veľké tímové produkty, kde Electron ekosystém a hotové pluginy šetria mesiace — alebo keď potrebuješ maximálnu kompatibilitu s Chromium-only API.',
        'Pre mňa je rozhodujúce, či produkt „má byť browser tab“. Ak nie — a má žiť na disku používateľa — Tauri je dnes jedna z najlepších ciest, ako zostať vo familiar TypeScript UI a stále dodať pocit desktop softvéru.',
      ],
      en: [
        'For Scribe Notes and Pulse API Client I needed desktop UX with filesystem access and local SQLite — without a 200 MB Electron runtime. Users expect fast startup, a small installer, and a native feel — not “Chrome in a window.”',
        'Tauri keeps the UI in React + TypeScript and sensitive parts (filesystem, HTTP, crypto, OS dialogs) in Rust commands. The boundary is clear: UI renders and collects intent, Rust executes privileged work. That shrinks the error surface and makes review easier.',
        'For a notes app that means local SQLite, a file tree, and an editor (TipTap) in a web stack I already know. For an API client: collections, request history, and safer secret storage closer to the OS — not in localStorage like a typical SPA.',
        'Trade-offs are real: WebView debugging, platform quirks (macOS vs Windows), and sometimes more Rust glue than Electron would “do for you.” If the team can’t or won’t learn Rust at least at the command level, velocity drops.',
        'When Tauri fits: local tools, offline-first products, apps where binary size and startup speed are part of UX. When it doesn’t: large team products where the Electron ecosystem and plugins save months — or when you need maximum Chromium-only API compatibility.',
        'For me the deciding question is whether the product “should be a browser tab.” If not — and it should live on the user’s disk — Tauri is one of the best ways to stay in familiar TypeScript UI and still ship something that feels like desktop software.',
      ],
    },
  },
  {
    id: 'convex-realtime',
    icon: '⚡',
    date: '2026-01-28',
    readingMinutes: 7,
    cover: 'docu-nest',
    accent: '#e9a800',
    outline: {
      sk: ['Realtime bez boilerplate', 'Model dát', 'Trade-offy'],
      en: ['Realtime without boilerplate', 'Data model', 'Trade-offs'],
    },
    extras: {
      sk: {
        callout: 'Convex žiari, keď UI = live query. Nie je univerzálna náhrada za každý Postgres.',
      },
      en: {
        callout: 'Convex shines when UI = live query. It isn’t a universal Postgres replacement.',
      },
    },
    tags: ['Convex', 'Next.js', 'Realtime'],
    title: {
      sk: 'Realtime bez websocket spaghetti — Convex v praxi',
      en: 'Realtime without websocket spaghetti — Convex in practice',
    },
    summary: {
      sk: 'Boom Scope: projekty, notes a canvas na live dátach — kedy sa oplatí backend-as-a-product.',
      en: 'Boom Scope: projects, notes, and canvas on live data — when backend-as-a-product pays off.',
    },
    body: {
      sk: [
        'Pri Boom Scope som chcel workspace, kde zmeny v notes a na canvase prídu okamžite — bez vlastného socket servera, reconnect logiky a conflict resolution od nuly. Convex to rieši ako produkt: queries sú live, mutácie sú transakčné, auth sedí k Next.js.',
        'Model je iný než klasické REST + Redis pub/sub. Pišeš funkcie blízko dát, klient subscribe-uje na query a UI sa aktualizuje samo. Menej glue kódu, viac času na produkt. Pre side project s malým tímom (alebo solo) je to obrovský pákový efekt.',
        'Obmedzenia treba poznať vopred: vendor lock-in, pricing pri raste, a menej „low-level“ kontroly než pri vlastnom NestJS + PostgreSQL. Ak potrebuješ komplexné reporty, multi-region write alebo prísny data residency, klasický stack môže byť čistejší.',
        'Kombinácia Next.js App Router + Convex + Clerk mi sedí na appky typu workspace: rýchly feedback loop, málo infra a jasný mental model. NestJS nechávam na enterprise API, kde kontrakty, audit a integrácie sú ťažšie ako realtime UX.',
        'Odporúčanie: prototypuj realtime features na Convexe, zmeraj, čo používatelia skutočne potrebujú, a až potom rozhodni, či držíš managed backend alebo migrujete kritiscké časti do vlastnej infraštruktúry.',
      ],
      en: [
        'For Boom Scope I wanted a workspace where notes and canvas updates land instantly — without owning a socket server, reconnect logic, and conflict resolution from scratch. Convex solves that as a product: queries are live, mutations are transactional, auth fits Next.js.',
        'The model differs from classic REST + Redis pub/sub. You write functions close to the data, the client subscribes to a query, and UI updates itself. Less glue, more product time. For a side project with a tiny team (or solo), that’s huge leverage.',
        'Know the limits early: vendor lock-in, pricing at scale, and less low-level control than NestJS + PostgreSQL. If you need heavy reporting, multi-region writes, or strict data residency, a classic stack can be cleaner.',
        'Next.js App Router + Convex + Clerk fits workspace-style apps: fast feedback loop, little infra, clear mental model. I keep NestJS for enterprise APIs where contracts, audit, and integrations weigh more than realtime UX.',
        'Recommendation: prototype realtime features on Convex, measure what users actually need, then decide whether to keep a managed backend or migrate critical pieces to owned infrastructure.',
      ],
    },
  },
  {
    id: 'typescript-end-to-end',
    icon: '📘',
    date: '2026-01-18',
    readingMinutes: 7,
    cover: 'pulse-apiclient',
    accent: '#2383e2',
    outline: {
      sk: ['Jeden typový príbeh', 'Hranice modulov', 'Čo netypovať'],
      en: ['One type story', 'Module boundaries', 'What not to type'],
    },
    extras: {
      sk: {
        callout: 'Typy majú znižovať kognitívnu záťaž — nie generovať ju cez `any` a `as`.',
      },
      en: {
        callout: 'Types should reduce cognitive load — not create it via `any` and `as`.',
      },
    },
    tags: ['TypeScript', 'DX', 'Architecture'],
    title: {
      sk: 'TypeScript end-to-end bez magie',
      en: 'TypeScript end-to-end without the magic',
    },
    summary: {
      sk: 'Zdieľané typy, validácia na hraniciach a prečo „any“ v API vrstve bolí neskôr.',
      en: 'Shared types, boundary validation, and why `any` in the API layer hurts later.',
    },
    body: {
      sk: [
        'Full-stack TypeScript nie je o tom mať rovnaký jazyk všade — je o tom mať rovnaké kontrakty. Keď DTO na backende a frontend typy žijú oddelene, regresia príde pri refaktore: backend zmení shape, frontend ešte týždeň renderuje staré polia a bug sa prejaví až u používateľa.',
        'Praktický pattern: validácia na hranici (Zod / class-validator), odvodené typy pre UI (`z.infer`) a zákaz tichého `any` vo fetch vrstve. NestJS + React to zvládne, ak tím berie typy ako dokumentáciu, nie ako optional lint, ktorý sa vypína „aby to prešlo CI“.',
        'Zdieľaný package s typmi pomáha, ale nie je strieborná guľka. Dôležitejšie je, kde sa kontrakt vymáha: pri vstupe do systému. Nevalidovaný `JSON.parse` + `as MyType` je len TypeScript theater — runtime ťa aj tak trestu.',
        'Na frontende mi pomáhajú úzke API klienty: jedna funkcia = jeden endpoint, návratový typ odvodený z schémy, errory modelované explicitne (nie `catch (e: any)`). TanStack Query potom cache-uje niečo, čomu môžeš veriť.',
        'Najväčší win je onboarding. Nový developer číta typy a schémy namiesto Slack archeológie. PR review sa posunie zo „aký shape má response?“ na správanie, edge casy a UX. To je rozdiel medzi tímom, ktorý škáluje, a tímom, ktorý len pridáva features.',
        'Začni tam, kde to bolí najviac: verejné API endpointy a miesta, kde UI najčastejšie padá na neočakávaných dátach. Nie treba prepísať celý monorepo za víkend — stačí urobiť hranice nepriepustné a zvyšok sa začne správať lepšie sám.',
      ],
      en: [
        'Full-stack TypeScript isn’t about the same language everywhere — it’s about the same contracts. When backend DTOs and frontend types drift apart, regressions show up mid-refactor: the backend changes shape, the frontend still renders old fields for a week, and the bug lands with the user.',
        'Practical pattern: validate at the boundary (Zod / class-validator), derive UI types from that (`z.infer`), and ban silent `any` in the fetch layer. NestJS + React handles this when the team treats types as docs — not optional lint you disable “so CI passes.”',
        'A shared types package helps, but it isn’t a silver bullet. What matters more is where the contract is enforced: at system entry. Unvalidated `JSON.parse` + `as MyType` is TypeScript theater — runtime still punishes you.',
        'On the frontend, narrow API clients help: one function = one endpoint, return type inferred from a schema, errors modeled explicitly (not `catch (e: any)`). TanStack Query then caches something you can actually trust.',
        'Biggest win: onboarding. New developers read types and schemas instead of Slack archaeology. PR review moves from “what shape is this response?” to behavior, edge cases, and UX. That’s the difference between a team that scales and a team that only adds features.',
        'Start where it hurts most: public API endpoints and the places UI most often breaks on unexpected data. You don’t need to rewrite the monorepo in a weekend — make the boundaries airtight and the rest starts behaving better on its own.',
      ],
    },
  },
  {
    id: 'mentoring-juniors',
    icon: '🌱',
    date: '2025-12-10',
    readingMinutes: 6,
    cover: 'experience',
    accent: '#9a6700',
    outline: {
      sk: ['Mentoring ≠ code review', 'Rámec rastu', 'Čo merať'],
      en: ['Mentoring ≠ code review', 'Growth frame', 'What to measure'],
    },
    extras: {
      sk: {
        callout:
          'Najlepší mentoring nechá juniora odísť so schopnosťou rozhodovať — nie s tvojím PR template.',
      },
      en: {
        callout:
          'Great mentoring leaves a junior able to decide — not just clone your PR template.',
      },
    },
    tags: ['Mentoring', 'Leadership', 'Team'],
    title: {
      sk: 'Mentoring juniorov bez micromanagementu',
      en: 'Mentoring juniors without micromanagement',
    },
    summary: {
      sk: 'Code review ako coaching, malé ownershipy a ako merať rast — nie počet komentárov v PR.',
      en: 'Code review as coaching, small ownerships, and how to measure growth — not PR comment count.',
    },
    body: {
      sk: [
        'Mentoring nie je „opravím ti PR za teba“. To je najrýchlejší spôsob, ako vychovať závislého developera. Cieľ je, aby junior nabudúce vedel rozhodnúť sám — s lepším modelom, nie s tvojím diffom skopírovaným do hlavnej vetvy.',
        'V code review pýtam otázky skôr než dávam príkazy: „Čo sa stane, keď request zlyhá?“ „Kde by toto zlyhalo pre screen reader?“ Junior sa učí myslieť; ty zistíš, či ide o medzeru vo vedomostiach alebo o deadline pressure.',
        'Dávam malé, jasné ownershipy: jeden komponent v design systéme, jeden endpoint, jeden monitoring alert. Ownership bez kontextu je strach. Ownership s mentorm v dosahu je rast.',
        'Meradlá: samostatnosť na podobnom tasku, kvalita otázok pred PR, a či vie vysvetliť trade-off. Nie počet riadkov ani počet emoji v Slacku. Soft skills sú súčasť craftu — komunikácia o riziku je engineering.',
        'Ak si medior/senior, mentoring je aj tvoja škola. Vysvetľovaním si overíš, či naozaj rozumieš architektúre. Tím je silnejší; ty máš menej bus-factor rizika. To je win-win, nie charita.',
      ],
      en: [
        'Mentoring isn’t “I’ll fix your PR for you.” That’s the fastest way to raise a dependent developer. The goal is that next time the junior can decide alone — with a better model, not your diff pasted into main.',
        'In review I ask questions before giving orders: “What happens when the request fails?” “Where would this break for a screen reader?” The junior learns to think; you learn whether it’s a knowledge gap or deadline pressure.',
        'I give small, clear ownerships: one design-system component, one endpoint, one monitoring alert. Ownership without context is fear. Ownership with a mentor in reach is growth.',
        'Metrics: independence on a similar task, quality of questions before the PR, and whether they can explain a trade-off. Not line count or Slack emoji. Soft skills are part of the craft — communicating risk is engineering.',
        'If you’re mid/senior, mentoring is also your school. Teaching verifies whether you actually understand the architecture. The team gets stronger; you reduce bus-factor risk. That’s win-win, not charity.',
      ],
    },
  },
  {
    id: 'react-performance',
    icon: '⚡',
    date: '2026-03-20',
    readingMinutes: 8,
    cover: 'code',
    accent: '#0b6e99',
    outline: {
      sk: ['Meraj pred optimalizáciou', 'Časté pasce', 'Checklist'],
      en: ['Measure before optimizing', 'Common traps', 'Checklist'],
    },
    extras: {
      sk: {
        list: ['Profiluj v React DevTools', 'Oddel render od dát', 'Memo až keď máš dôkaz'],
        callout: 'useMemo nie je architektúra. Najprv zisti, čo sa znova renderuje a prečo.',
      },
      en: {
        list: ['Profile in React DevTools', 'Separate render from data', 'Memo only with evidence'],
        callout: 'useMemo isn’t architecture. First learn what re-renders and why.',
      },
    },
    tags: ['React', 'Performance', 'DX'],
    title: {
      sk: 'React performance bez predčasnej optimalizácie',
      en: 'React performance without premature optimization',
    },
    summary: {
      sk: 'Profiluj skôr než memoizuješ. Kde reálne bolí render, sieť a layout — a čo riešiť ako posledné.',
      en: 'Profile before you memoize. Where render, network, and layout actually hurt — and what to fix last.',
    },
    body: {
      sk: [
        'Najčastejšia chyba nie je pomalý React — je to `useMemo` všade, pretože „tak sa to robí“. Memoizácia bez merania je šum. Najprv otvor React Profiler / Performance panel a pomenuj bottleneck: zbytočné re-rendery, veľký list, drahý layout, alebo čakanie na sieť.',
        'Hierarchia fixov: 1) menej práce (rozdeľ komponenty, vytiahni state bližšie k listu), 2) lacnejší render (virtualizácia, pagination), 3) menej čakania (prefetch, Suspense boundaries, cache), 4) až potom mikro-optimalizácie (`memo`, `useCallback`). Väčšina produktov vyhrá na krokoch 1–3.',
        'V enterprise UI (Fluent, husté tabuľky) často bolí layout thrashing a príliš veľa context providerov. Stabilné kľúče, oddelené „dumb“ riadky a oddelený selection state ušetria viac než desiatky `memo`.',
        'Sieť je UX. Skeleton a optimistic UI nevyzerajú ako „performance hack“ — sú to produktové rozhodnutia. TanStack Query s dobrým `staleTime` často „zrýchli“ appku viac než tri `useMemo`.',
        'Pravidlo: optimalizuj to, čo vieš zopakovať v profile. Ak po zmene nie je merateľný rozdiel, rollback. Performance PR bez metriky je len noise v git histórii.',
        'A keď naozaj treba: `startTransition` pre nie-urgentné updaty, `useDeferredValue` pre heavy filtre, a lazy route-level code splitting. Nástroje existujú — použij ich cielene, nie ako default template.',
      ],
      en: [
        'The most common mistake isn’t slow React — it’s `useMemo` everywhere because “that’s how it’s done.” Memoization without measurement is noise. Open the React Profiler / Performance panel first and name the bottleneck: wasteful re-renders, a huge list, expensive layout, or network wait.',
        'Fix hierarchy: 1) less work (split components, pull state closer to the list), 2) cheaper render (virtualization, pagination), 3) less waiting (prefetch, Suspense boundaries, cache), 4) only then micro-opts (`memo`, `useCallback`). Most products win on steps 1–3.',
        'In enterprise UI (Fluent, dense tables) layout thrashing and too many context providers often hurt more. Stable keys, dumb row components, and separated selection state beat dozens of `memo`s.',
        'Network is UX. Skeletons and optimistic UI aren’t “performance hacks” — they’re product decisions. TanStack Query with a sane `staleTime` often “speeds up” the app more than three `useMemo`s.',
        'Rule: optimize what you can reproduce in a profile. No measurable delta after a change? Rollback. A performance PR without a metric is just noise in git history.',
        'And when you really need it: `startTransition` for non-urgent updates, `useDeferredValue` for heavy filters, and lazy route-level code splitting. The tools exist — use them on purpose, not as a default template.',
      ],
    },
  },
  {
    id: 'code-review-culture',
    icon: '🔍',
    date: '2026-03-08',
    readingMinutes: 7,
    cover: 'about',
    accent: '#6940a5',
    outline: {
      sk: ['Review ako učenie', 'Čo komentovať', 'Rýchlosť vs kvalita'],
      en: ['Review as learning', 'What to comment', 'Speed vs quality'],
    },
    extras: {
      sk: {
        callout: 'Dobrý review komentár vysvetľuje trade-off — nie len „zmeň toto“.',
      },
      en: {
        callout: 'A good review comment explains the trade-off — not just “change this.”',
      },
    },
    tags: ['Code review', 'Team', 'DX'],
    title: {
      sk: 'Code review, ktoré učí — nie len blokuje merge',
      en: 'Code review that teaches — not just blocks merge',
    },
    summary: {
      sk: 'Čo komentovať, čo neriešiť v PR, a ako z review urobiť coaching namiesto gatekeepingu.',
      en: 'What to comment on, what not to bike-shed in a PR, and how to turn review into coaching instead of gatekeeping.',
    },
    body: {
      sk: [
        'Zlý review je checklist nitpickov: naming, poradie importov, osobný taste. Dobrý review chráni používateľa a budúceho developera: správnosť, edge casy, bezpečnosť, čitateľnosť kontraktu, regresné riziko.',
        'Oddeluj blocker vs. nit. Blocker = „toto rozbije produkciu / dáta / a11y“. Nit = „preferoval by som X“ — a nit neblokuje merge. Ak všetko je blocker, tím sa naučí báť sa review namiesto učiť sa z neho.',
        'Píš otázky a dôvod, nie len príkaz. „Tu by som dal early return, lebo…“ učí. „Zmeň toto“ vytvára závislosť. Pri junioroch je review najlacnejší mentoring, aký máš.',
        'Veľkosť PR je feature. 80 riadkov s jedným cieľom reviewuješ lepšie než 800 riadkov „aj refaktor aj feature“. Ak musí byť veľké, rozdeľ commitmi a popisom: čo testovať, čo je zámerné breaking.',
        'Automatizuj vkus: formatter, lint, typecheck, basic a11y. Ľudský review má ísť na veci, ktoré CI nevie. Inak míňaš senior čas na to, čo vie Biome za 40 ms.',
        'Kultúra: ďakuj za dobré PR, chváľ dobré rozhodnutia nahlas. Review nie je súd. Je to spoločná ochrana produktu — a signál, že kvalita je tímová, nie individuálna hrdosť.',
      ],
      en: [
        'Bad review is a checklist of nits: naming, import order, personal taste. Good review protects the user and the next developer: correctness, edge cases, security, contract readability, regression risk.',
        'Separate blocker vs nit. Blocker = “this breaks production / data / a11y.” Nit = “I’d prefer X” — and nits don’t block merge. If everything is a blocker, the team learns to fear review instead of learn from it.',
        'Write questions and reasons, not just orders. “I’d early-return here because…” teaches. “Change this” creates dependency. For juniors, review is the cheapest mentoring you have.',
        'PR size is a feature. Eighty lines with one goal review better than 800 lines of “refactor + feature.” If it must be large, split with commits and a description: what to test, what’s intentional breaking.',
        'Automate taste: formatter, lint, typecheck, basic a11y. Human review should spend time on what CI can’t see. Otherwise you burn senior minutes on what Biome catches in 40ms.',
        'Culture: thank good PRs, praise good decisions out loud. Review isn’t a trial. It’s shared protection of the product — and a signal that quality is a team sport, not individual pride.',
      ],
    },
  },
  {
    id: 'api-boundaries',
    icon: '🔌',
    date: '2026-02-18',
    readingMinutes: 8,
    cover: 'pulse-apiclient',
    accent: '#18747a',
    outline: {
      sk: ['Hranice a kontrakty', 'Chybové stavy', 'Dokumentácia pri kóde'],
      en: ['Boundaries and contracts', 'Error states', 'Docs next to code'],
    },
    extras: {
      sk: {
        callout:
          'Ak developer potrebuje Slack na pochopenie endpointu, platforma zlyhala — aj s pekným Swaggerom.',
      },
      en: {
        callout:
          'If a developer needs Slack to understand an endpoint, the platform failed — pretty Swagger or not.',
      },
    },
    tags: ['API', 'NestJS', 'Architecture'],
    title: {
      sk: 'API hranice, ktoré produktový tím neobchádza',
      en: 'API boundaries product teams don’t route around',
    },
    summary: {
      sk: 'Verzie, chyby, idempotencia a prečo „rýchly endpoint naviac“ zabíja platformu.',
      en: 'Versions, errors, idempotency — and why “one quick extra endpoint” kills the platform.',
    },
    body: {
      sk: [
        'API nie je zoznam controllerov. Je to kontrakt medzi tímami. Keď frontend potrebuje „ešte jedno pole“, a ty pridáš endpoint bez vlastníka, o rok máš zoo one-off routes a nikto nevie, čo je kanonické.',
        'Začni od use-casov, nie od tabuliek. Resource model (`/licenses/:id`) + jasné commandy (`POST .../renew`) bije anémické CRUD, kde UI skladá business logiku z piatich GET-ov. NestJS modules majú sedieť na bounded contexts, nie na „všetko v AppModule“.',
        'Chyby majú shape. `code`, `message`, `fields` — konzistentné naprieč službami. Frontend potom vie mapovať UI, nie parsovať náhodný string. 4xx vs 5xx nie je akademická diskusia; je to SLA a alerting.',
        'Idempotencia pri write operáciách (platby, submit formulárov, sync) šetrí support tickets. `Idempotency-Key` alebo prirodzený business kľúč. Retry bez nej je duplicitný chaos.',
        'Verzie a deprecation: breaking change bez komunikácie je incident. Preferuj additive zmeny; keď musíš lámať, deadline + dual-run. „Dočasný endpoint“ bez ownera sa stane večný.',
        'Dokumentácia pri kóde (OpenAPI generované z DTO) + príklady request/response. Ak developer potrebuje Slack, aby pochopil endpoint, platforma neuspela — bez ohľadu na to, ako pekný má Swagger UI.',
      ],
      en: [
        'An API isn’t a list of controllers. It’s a contract between teams. When frontend needs “one more field” and you add an ownerless endpoint, a year later you have a zoo of one-offs and no one knows what’s canonical.',
        'Start from use cases, not tables. A resource model (`/licenses/:id`) plus clear commands (`POST .../renew`) beats anemic CRUD where UI assembles business logic from five GETs. NestJS modules should map to bounded contexts — not “everything in AppModule.”',
        'Errors need a shape. `code`, `message`, `fields` — consistent across services. Frontend can map UI instead of parsing random strings. 4xx vs 5xx isn’t academic; it’s SLA and alerting.',
        'Idempotency on writes (payments, form submit, sync) saves support tickets. `Idempotency-Key` or a natural business key. Retry without it is duplicate chaos.',
        'Versions and deprecation: a breaking change without communication is an incident. Prefer additive changes; when you must break, set a deadline and dual-run. A “temporary endpoint” with no owner becomes permanent.',
        'Docs next to code (OpenAPI generated from DTOs) plus request/response examples. If a developer needs Slack to understand an endpoint, the platform failed — no matter how pretty the Swagger UI looks.',
      ],
    },
  },
  {
    id: 'a11y-enterprise',
    icon: '♿',
    date: '2026-01-28',
    readingMinutes: 7,
    cover: 'contact',
    accent: '#0f7b6c',
    outline: {
      sk: ['A11y je UX kvalita', 'Fluent nestačí', 'DoD a CI'],
      en: ['A11y is UX quality', 'Fluent isn’t enough', 'DoD and CI'],
    },
    extras: {
      sk: {
        list: ['Tab order pred pixel-perfect', 'Label + aria-describedby', 'Focus trap v modaloch'],
        callout: 'Zaraď a11y do Definition of Done. Po audite už bolí.',
      },
      en: {
        list: [
          'Tab order before pixel-perfect',
          'Label + aria-describedby',
          'Focus traps in modals',
        ],
        callout: 'Bake a11y into the Definition of Done. After an audit it already hurts.',
      },
    },
    tags: ['Accessibility', 'Fluent UI', 'UX'],
    title: {
      sk: 'Prístupnosť v enterprise UI nie je „nice to have“',
      en: 'Accessibility in enterprise UI isn’t a nice-to-have',
    },
    summary: {
      sk: 'Keyboard, focus, kontrast a prečo Fluent/SharePoint bez a11y nie je hotový produkt.',
      en: 'Keyboard, focus, contrast — and why Fluent/SharePoint without a11y isn’t a finished product.',
    },
    body: {
      sk: [
        'V enterprise často počuješ „naši useri to nepoužívajú so screen readerom“. To je predpoklad, nie dátum. Klávesnica, fokus a kontrast pomáhajú aj power userom a ľuďom s dočasnými obmedzeniami. A11y je UX kvalita, nie checkbox na konci sprintu.',
        'Fluent UI ti dáva dobrý základ — ale nezachráni zlý custom overlay, focustrap, ktorý nefunguje, alebo tabuľku, kde sa nedá dostať na akcie bez myši. Testuj Tab order skôr než vizuálny pixel-perfect.',
        'Kontrast a hustota: enterprise love tiny gray text. Ak dizajn systém povoľuje nečitateľné tokeny, oprav tokeny — nie každú obrazovku zvlášť. Design systém je aj a11y systém.',
        'Formuláre: label vždy viazaný, chyby oznamované prístupne (`aria-describedby`), disabled nie ako jediný stav pre „nemôžeš“. Modal: focus in, focus back, Escape. Toto sú opakujúce sa bugy, nie one-off.',
        'Automatizácia: axe/lighthouse v CI chytí nízko visiace ovocie. Manuálny keyboard pass na kritických flowoch (login, submit, admin akcie) zachytí zvyšok. Bez oboch máš falošný pocit bezpečia.',
        'Ak dodávaš pre verejný sektor alebo healthcare, a11y nie je brand story — je to požiadavka. Buduj ju do Definition of Done. Inak ju doháňaš po audite, keď už bolí.',
      ],
      en: [
        'In enterprise you often hear “our users don’t use a screen reader.” That’s an assumption, not data. Keyboard, focus, and contrast also help power users and people with temporary impairments. A11y is UX quality, not a checkbox at sprint end.',
        'Fluent UI gives a solid base — but it won’t save a broken custom overlay, a focus trap that fails, or a table where actions aren’t reachable without a mouse. Test Tab order before pixel-perfect visuals.',
        'Contrast and density: enterprise loves tiny gray text. If the design system allows unreadable tokens, fix the tokens — not every screen one by one. A design system is an a11y system too.',
        'Forms: labels always wired, errors announced accessibly (`aria-describedby`), disabled not the only “you can’t” state. Modals: focus in, focus restore, Escape. These are recurring bugs, not one-offs.',
        'Automation: axe/Lighthouse in CI catches low-hanging fruit. A manual keyboard pass on critical flows (login, submit, admin actions) catches the rest. Without both you get false confidence.',
        'If you ship for public sector or healthcare, a11y isn’t a brand story — it’s a requirement. Bake it into the Definition of Done. Otherwise you chase it after an audit, when it already hurts.',
      ],
    },
  },
]

function finalizeNote(draft: NoteDraft): Note {
  const { outline, extras, body, readingMinutes: _ignored, ...rest } = draft
  const resolved = upgradeBody(body, outline, extras)
  // Prefer SK for counting (primary locale); EN is parallel content.
  const wordCount = countWords(flattenNoteBody(resolved.sk))
  return {
    ...rest,
    body: resolved,
    wordCount,
    readingMinutes: estimateReadingMinutes(wordCount),
  }
}

/** Newest first — single sorted source for listing & adjacency. */
export const notes: Note[] = notesSource
  .map(finalizeNote)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

const notesById = new Map(notes.map((note) => [note.id, note]))

export function getNote(id: string): Note | undefined {
  return notesById.get(id)
}

export function isNoteId(value: string): boolean {
  return notesById.has(value)
}

export function getNoteTags(): string[] {
  const set = new Set<string>()
  for (const note of notes) {
    for (const tag of note.tags) set.add(tag)
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}

export function getNotesByTag(tag: string | null): Note[] {
  if (!tag) return notes
  return notes.filter((note) => note.tags.includes(tag))
}

export function getRelatedNotes(noteId: string, limit = 3): Note[] {
  const current = getNote(noteId)
  if (!current) return []

  const tagSet = new Set(current.tags)
  return notes
    .filter((note) => note.id !== noteId)
    .map((note) => ({
      note,
      score: note.tags.reduce((sum, tag) => sum + (tagSet.has(tag) ? 1 : 0), 0),
    }))
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || (a.note.date < b.note.date ? 1 : a.note.date > b.note.date ? -1 : 0),
    )
    .slice(0, limit)
    .map((item) => item.note)
}

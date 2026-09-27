export type Note = {
  id: string
  icon: string
  date: string
  readingMinutes: number
  tags: string[]
  title: { sk: string; en: string }
  summary: { sk: string; en: string }
  body: { sk: string[]; en: string[] }
}

export const notes: Note[] = [
  {
    id: 'design-systems',
    icon: '🎨',
    date: '2026-03-12',
    readingMinutes: 8,
    tags: ['Design systems', 'React', 'Fluent UI'],
    title: {
      sk: 'Design systém, ktorý tím skutočne používa',
      en: 'A design system the team actually ships with',
    },
    summary: {
      sk: 'Tokeny, dokumentácia a code review — čo oddelí knižnicu komponentov od mŕtvej dokumentácie.',
      en: 'Tokens, docs, and code review — what separates a component library from dead documentation.',
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
    id: 'tauri-desktop',
    icon: '🖥️',
    date: '2026-02-04',
    readingMinutes: 9,
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
    id: 'typescript-end-to-end',
    icon: '📘',
    date: '2026-01-18',
    readingMinutes: 7,
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
]

export function getNote(id: string): Note | undefined {
  return notes.find((note) => note.id === id)
}

export function isNoteId(value: string): boolean {
  return notes.some((note) => note.id === value)
}

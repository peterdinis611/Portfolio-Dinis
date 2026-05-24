/**
 * ═══════════════════════════════════════════════════════════════════
 *  PORTFOLIO DATA — uprav len tento súbor (SK + EN)
 * ═══════════════════════════════════════════════════════════════════
 */
window.GameData = {
  introName: 'PETER DINIS',

  portfolio: {
    sk: {
      name: 'Peter Dinis',
      title: 'Full-Stack Developer & Creative Technologist',
      bio: 'Tvorím hravé, výkonné webové zážitky na priesečníku dizajnu a inžinierstva. Milujem premieňať zložité nápady na intuitívne rozhrania.',
      interests: ['🎮', '☕', '🎸', '🌿', '📷', '♟️'],
      email: 'peter.dinis@example.com',
      social: {
        github: 'https://github.com/example',
        linkedin: 'https://linkedin.com/in/example',
        twitter: 'https://twitter.com/example',
        email: 'mailto:peter.dinis@example.com'
      },
      projects: [
        {
          name: 'Nebula Dashboard',
          desc: 'Real-time analytický dashboard s WebSocket streamom a D3 vizualizáciami.',
          tags: ['React', 'TypeScript', 'D3', 'Node'],
          live: 'https://example.com/nebula',
          github: 'https://github.com/example/nebula'
        },
        {
          name: 'Pixel Quest Engine',
          desc: 'Ľahký 2D herný engine vo vanilla JS — tilemapy, kolízie, animácie.',
          tags: ['Canvas', 'JavaScript', 'Web Audio'],
          live: 'https://example.com/pixelquest',
          github: 'https://github.com/example/pixelquest'
        },
        {
          name: 'EcoTrack API',
          desc: 'Sledovanie uhlíkovej stopy s ML odporúčaniami a PostgreSQL time-series.',
          tags: ['Python', 'FastAPI', 'PostgreSQL', 'ML'],
          live: 'https://example.com/ecotrack',
          github: 'https://github.com/example/ecotrack'
        }
      ],
      experience: [
        {
          role: 'Senior Frontend Engineer',
          company: 'Luminary Labs',
          dates: '2022 — súčasnosť',
          bullets: ['Design system pre 12 tímov', 'Bundle −40 % code-splittingom', 'Mentor pre 5 juniorov'],
          weather: 0.1
        },
        {
          role: 'Full-Stack Developer',
          company: 'Streamline Co',
          dates: '2019 — 2022',
          bullets: ['Real-time spolupráca', 'Migrácia na micro-frontends', 'PWA s Lighthouse 98'],
          weather: 0.35
        },
        {
          role: 'Junior Web Developer',
          company: 'StartUp Hub',
          dates: '2017 — 2019',
          bullets: ['WordPress témy', 'Automatizované testy', 'Open-source pluginy'],
          weather: 0.65
        },
        {
          role: 'Intern — Web Dev',
          company: 'Creative Agency X',
          dates: '2016 — 2017',
          bullets: ['Responzívne landingy', 'Git workflow', 'SVG animácie'],
          weather: 0.9
        }
      ],
      bubbles: { bio: '👋 Ahoj!', passions: '💡 Vášne', portrait: '🖼️ Portrét' }
    },
    en: {
      name: 'Peter Dinis',
      title: 'Full-Stack Developer & Creative Technologist',
      bio: 'I craft playful, performant web experiences at the intersection of design and engineering. I love turning complex ideas into intuitive interfaces.',
      interests: ['🎮', '☕', '🎸', '🌿', '📷', '♟️'],
      email: 'peter.dinis@example.com',
      social: {
        github: 'https://github.com/example',
        linkedin: 'https://linkedin.com/in/example',
        twitter: 'https://twitter.com/example',
        email: 'mailto:peter.dinis@example.com'
      },
      projects: [
        {
          name: 'Nebula Dashboard',
          desc: 'Real-time analytics dashboard with WebSocket streaming and D3 visualizations.',
          tags: ['React', 'TypeScript', 'D3', 'Node'],
          live: 'https://example.com/nebula',
          github: 'https://github.com/example/nebula'
        },
        {
          name: 'Pixel Quest Engine',
          desc: 'Lightweight 2D game engine in vanilla JS with tilemaps, collision, and sprites.',
          tags: ['Canvas', 'JavaScript', 'Web Audio'],
          live: 'https://example.com/pixelquest',
          github: 'https://github.com/example/pixelquest'
        },
        {
          name: 'EcoTrack API',
          desc: 'Carbon footprint tracker with ML recommendations and PostgreSQL time-series.',
          tags: ['Python', 'FastAPI', 'PostgreSQL', 'ML'],
          live: 'https://example.com/ecotrack',
          github: 'https://github.com/example/ecotrack'
        }
      ],
      experience: [
        {
          role: 'Senior Frontend Engineer',
          company: 'Luminary Labs',
          dates: '2022 — Present',
          bullets: ['Design system across 12 teams', '40% smaller bundles', 'Mentored 5 juniors'],
          weather: 0.1
        },
        {
          role: 'Full-Stack Developer',
          company: 'Streamline Co',
          dates: '2019 — 2022',
          bullets: ['Real-time collaboration', 'Micro-frontends migration', 'PWA Lighthouse 98'],
          weather: 0.35
        },
        {
          role: 'Junior Web Developer',
          company: 'StartUp Hub',
          dates: '2017 — 2019',
          bullets: ['WordPress themes', 'Automated testing', 'Open-source plugins'],
          weather: 0.65
        },
        {
          role: 'Intern — Web Dev',
          company: 'Creative Agency X',
          dates: '2016 — 2017',
          bullets: ['Responsive landings', 'Git workflows', 'SVG prototypes'],
          weather: 0.9
        }
      ],
      bubbles: { bio: '👋 Hi!', passions: '💡 Passions', portrait: '🖼️ Portrait' }
    }
  },

  levels: {
    sk: [
      { id: 0, name: 'LEVEL 1 — O mne', sub: 'Dedinka', colors: ['#FFD580', '#FF8C42', '#3D2B1F'], overlay: 'rgba(255,140,66,0.12)' },
      { id: 1, name: 'LEVEL 2 — Projekty', sub: 'Cyber mesto', colors: ['#0D0D1A', '#00F5FF', '#FF00A0'], overlay: 'rgba(0,245,255,0.08)' },
      { id: 2, name: 'LEVEL 3 — Skúsenosti', sub: 'Les', colors: ['#1A2E1A', '#5C8A3C', '#C9A84C'], overlay: 'rgba(92,138,60,0.1)' },
      { id: 3, name: 'LEVEL 4 — Kontakt', sub: 'Pláž', colors: ['#FFF1B0', '#4DA6FF', '#FF7043'], overlay: 'rgba(77,166,255,0.1)' }
    ],
    en: [
      { id: 0, name: 'LEVEL 1 — About Me', sub: 'Cozy Village', colors: ['#FFD580', '#FF8C42', '#3D2B1F'], overlay: 'rgba(255,140,66,0.12)' },
      { id: 1, name: 'LEVEL 2 — Projects', sub: 'Futuristic City', colors: ['#0D0D1A', '#00F5FF', '#FF00A0'], overlay: 'rgba(0,245,255,0.08)' },
      { id: 2, name: 'LEVEL 3 — Experience', sub: 'Ancient Forest', colors: ['#1A2E1A', '#5C8A3C', '#C9A84C'], overlay: 'rgba(92,138,60,0.1)' },
      { id: 3, name: 'LEVEL 4 — Contact', sub: 'Harbor Beach', colors: ['#FFF1B0', '#4DA6FF', '#FF7043'], overlay: 'rgba(77,166,255,0.1)' }
    ]
  },

  /** Nočné palety pre canvas (dark mode) */
  levelsNight: {
    sk: [
      { id: 0, name: 'LEVEL 1 — O mne', sub: 'Dedinka', colors: ['#1a1520', '#3d2a4a', '#0f0a14'], overlay: 'rgba(80,60,120,0.2)' },
      { id: 1, name: 'LEVEL 2 — Projekty', sub: 'Cyber mesto', colors: ['#050508', '#00a8b3', '#990066'], overlay: 'rgba(0,180,200,0.12)' },
      { id: 2, name: 'LEVEL 3 — Skúsenosti', sub: 'Les', colors: ['#0a140a', '#2a4a2a', '#3a3520'], overlay: 'rgba(40,80,50,0.15)' },
      { id: 3, name: 'LEVEL 4 — Kontakt', sub: 'Pláž', colors: ['#1a1a2e', '#1a4a6a', '#2a3040'], overlay: 'rgba(30,80,120,0.15)' }
    ],
    en: [
      { id: 0, name: 'LEVEL 1 — About Me', sub: 'Cozy Village', colors: ['#1a1520', '#3d2a4a', '#0f0a14'], overlay: 'rgba(80,60,120,0.2)' },
      { id: 1, name: 'LEVEL 2 — Projects', sub: 'Futuristic City', colors: ['#050508', '#00a8b3', '#990066'], overlay: 'rgba(0,180,200,0.12)' },
      { id: 2, name: 'LEVEL 3 — Experience', sub: 'Ancient Forest', colors: ['#0a140a', '#2a4a2a', '#3a3520'], overlay: 'rgba(40,80,50,0.15)' },
      { id: 3, name: 'LEVEL 4 — Contact', sub: 'Harbor Beach', colors: ['#1a1a2e', '#1a4a6a', '#2a3040'], overlay: 'rgba(30,80,120,0.15)' }
    ]
  },

  photo: 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
    '<rect fill="#3D2B1F" width="200" height="200"/>' +
    '<circle cx="100" cy="75" r="40" fill="#FFD580"/>' +
    '<rect x="55" y="120" width="90" height="70" rx="8" fill="#FF8C42"/>' +
    '<text x="100" y="195" text-anchor="middle" fill="#FFD580" font-family="sans-serif" font-size="11">PD</text></svg>'
  ),

  projectThumbs: [
    'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="#0D0D1A" width="400" height="200"/><rect x="20" y="20" width="360" height="30" fill="#00F5FF" opacity="0.5"/><rect x="20" y="60" width="160" height="120" fill="#FF00A0" opacity="0.4"/></svg>'),
    'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="#1a0a2e" width="400" height="200"/><text x="200" y="110" text-anchor="middle" fill="#00F5FF" font-family="monospace" font-size="24">PIXEL QUEST</text></svg>'),
    'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="#0a1a0a" width="400" height="200"/><circle cx="200" cy="100" r="60" fill="none" stroke="#5C8A3C" stroke-width="4"/></svg>')
  ]
};

window.GameData.i18n = {
  sk: {
    introSub: 'Full-Stack Developer & Creative Technologist',
    loading: ['Generujem postavu...', 'Staviam dedinku...', 'Načítavam mesto...', 'Rastie les...', 'Prístav je pripravený...', 'Hotovo!'],
    startBtn: '▶ Začať dobrodružstvo',
    charSelect: 'Vyber postavu',
    walker: 'Pešiak',
    car: 'Auto',
    lang: 'Jazyk',
    theme: 'Téma',
    themeLight: 'Deň',
    themeDark: 'Noc',
    hudMoveWalker: 'WASD / šípky',
    hudMoveCar: 'WASD / šípky · Shift turbo',
    hudJump: 'Medzerník skok',
    hudInteract: 'E interakcia',
    hudNear: 'Blízko',
    interact: 'Interakcia',
    jump: 'Skok',
    modalAbout: 'O mne',
    modalContact: 'Správa',
    modalClose: 'Zavrieť',
    send: 'Odoslať',
    name: 'Meno',
    email: 'Email',
    message: 'Správa',
    viewLive: 'Živá verzia',
    github: 'GitHub',
    endTitle: 'Ďakujem za návštevu.<br/>Poďme spolu niečo vytvoriť.',
    endSub: 'Peter Dinis · Pixel Portfolio',
    endContact: 'Kontakt',
    endReplay: 'Prejsť znova',
    gateAbout: 'O MNE',
    gateProjects: 'PROJEKTY',
    gateExperience: 'SKÚSENOSTI',
    gateContact: 'KONTAKT',
    endSign1: 'SI V CIELI',
    endSign2: 'KONIEC!',
    labelBio: 'Bio',
    labelPassions: 'Vášne',
    labelPortrait: 'Portrét',
    labelBottle: 'Fľaška'
  },
  en: {
    introSub: 'Full-Stack Developer & Creative Technologist',
    loading: ['Generating hero...', 'Building village...', 'Loading city...', 'Growing forest...', 'Harbor ready...', 'Ready!'],
    startBtn: '▶ Start adventure',
    charSelect: 'Choose character',
    walker: 'Walker',
    car: 'Car',
    lang: 'Language',
    theme: 'Theme',
    themeLight: 'Day',
    themeDark: 'Night',
    hudMoveWalker: 'WASD / arrows',
    hudMoveCar: 'WASD / arrows · Shift turbo',
    hudJump: 'Space jump',
    hudInteract: 'E interact',
    hudNear: 'Near',
    interact: 'Interact',
    jump: 'Jump',
    modalAbout: 'About Me',
    modalContact: 'Send a Message',
    modalClose: 'Close',
    send: 'Send',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    viewLive: 'View Live',
    github: 'GitHub',
    endTitle: 'Thanks for visiting.<br/>Let\'s build something great.',
    endSub: 'Peter Dinis · Pixel Portfolio',
    endContact: 'Contact',
    endReplay: 'Explore again',
    gateAbout: 'ABOUT',
    gateProjects: 'PROJECTS',
    gateExperience: 'EXPERIENCE',
    gateContact: 'CONTACT',
    endSign1: 'YOU MADE IT',
    endSign2: 'THE END!',
    labelBio: 'Bio scroll',
    labelPassions: 'Interests',
    labelPortrait: 'Portrait',
    labelBottle: 'Message in a bottle'
  }
};

import { assign, setup } from 'xstate'
import type { Lang, Theme } from '../i18n/translations'

function loadSetting<T extends string>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    if (v) return v as T
  } catch {
    /* ignore */
  }
  return fallback
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

const initialTheme = loadSetting<Theme>('portfolio-theme', 'light')
applyTheme(initialTheme)

export type SettingsContext = {
  lang: Lang
  theme: Theme
}

export type SettingsEvent =
  | { type: 'SET_LANG'; lang: Lang }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_LANG' }

export const settingsMachine = setup({
  types: {
    context: {} as SettingsContext,
    events: {} as SettingsEvent,
  },
  actions: {
    persistLang: ({ context }) => {
      localStorage.setItem('portfolio-lang', context.lang)
    },
    persistTheme: ({ context }) => {
      localStorage.setItem('portfolio-theme', context.theme)
      applyTheme(context.theme)
    },
    assignLang: assign({
      lang: ({ event }) => (event.type === 'SET_LANG' ? event.lang : 'sk'),
    }),
    assignTheme: assign({
      theme: ({ event }) => (event.type === 'SET_THEME' ? event.theme : 'dark'),
    }),
    toggleTheme: assign({
      theme: ({ context }) => (context.theme === 'dark' ? 'light' : 'dark'),
    }),
    toggleLang: assign({
      lang: ({ context }) => (context.lang === 'sk' ? 'en' : 'sk'),
    }),
  },
}).createMachine({
  id: 'settings',
  initial: 'ready',
  context: {
    lang: loadSetting<Lang>('portfolio-lang', 'sk'),
    theme: initialTheme,
  },
  states: {
    ready: {
      on: {
        SET_LANG: {
          actions: ['assignLang', 'persistLang'],
        },
        SET_THEME: {
          actions: ['assignTheme', 'persistTheme'],
        },
        TOGGLE_THEME: {
          actions: ['toggleTheme', 'persistTheme'],
        },
        TOGGLE_LANG: {
          actions: ['toggleLang', 'persistLang'],
        },
      },
    },
  },
})

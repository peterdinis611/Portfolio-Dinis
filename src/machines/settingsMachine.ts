import { assign, setup } from 'xstate'
import type { Lang, Theme } from '../i18n/translations'

export type AnimationsPref = 'on' | 'off'

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

function applyAnimations(animations: AnimationsPref) {
  document.documentElement.dataset.animations = animations
}

const initialTheme = loadSetting<Theme>('portfolio-theme', 'light')
const initialAnimations = loadSetting<AnimationsPref>('portfolio-animations', 'on')
applyTheme(initialTheme)
applyAnimations(initialAnimations)

export type SettingsContext = {
  lang: Lang
  theme: Theme
  animations: AnimationsPref
}

export type SettingsEvent =
  | { type: 'SET_LANG'; lang: Lang }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_LANG' }
  | { type: 'SET_ANIMATIONS'; animations: AnimationsPref }
  | { type: 'TOGGLE_ANIMATIONS' }

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
    persistAnimations: ({ context }) => {
      localStorage.setItem('portfolio-animations', context.animations)
      applyAnimations(context.animations)
    },
    assignLang: assign({
      lang: ({ event }) => (event.type === 'SET_LANG' ? event.lang : 'sk'),
    }),
    assignTheme: assign({
      theme: ({ event }) => (event.type === 'SET_THEME' ? event.theme : 'dark'),
    }),
    assignAnimations: assign({
      animations: ({ event }) => (event.type === 'SET_ANIMATIONS' ? event.animations : 'on'),
    }),
    toggleTheme: assign({
      theme: ({ context }) => (context.theme === 'dark' ? 'light' : 'dark'),
    }),
    toggleLang: assign({
      lang: ({ context }) => (context.lang === 'sk' ? 'en' : 'sk'),
    }),
    toggleAnimations: assign({
      animations: ({ context }) => (context.animations === 'on' ? 'off' : 'on'),
    }),
  },
}).createMachine({
  id: 'settings',
  initial: 'ready',
  context: {
    lang: loadSetting<Lang>('portfolio-lang', 'sk'),
    theme: initialTheme,
    animations: initialAnimations,
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
        SET_ANIMATIONS: {
          actions: ['assignAnimations', 'persistAnimations'],
        },
        TOGGLE_ANIMATIONS: {
          actions: ['toggleAnimations', 'persistAnimations'],
        },
      },
    },
  },
})

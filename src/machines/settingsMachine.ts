import { assign, setup } from 'xstate'
import type { Theme } from '../i18n/translations'

export type AnimationsPref = 'on' | 'off'

function loadSetting<T extends string>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const v = localStorage.getItem(key)
    if (v) return v as T
  } catch {
    /* ignore */
  }
  return fallback
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    document.cookie = `portfolio-theme=${theme};path=/;max-age=31536000;samesite=lax`
  } catch {
    /* ignore */
  }
}

function applyAnimations(animations: AnimationsPref) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.animations = animations
}

function readInitialTheme(): Theme {
  return loadSetting<Theme>('portfolio-theme', 'light')
}

function readInitialAnimations(): AnimationsPref {
  return loadSetting<AnimationsPref>('portfolio-animations', 'on')
}

export type SettingsContext = {
  theme: Theme
  animations: AnimationsPref
}

export type SettingsEvent =
  | { type: 'HYDRATE' }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_ANIMATIONS'; animations: AnimationsPref }
  | { type: 'TOGGLE_ANIMATIONS' }

export const settingsMachine = setup({
  types: {
    context: {} as SettingsContext,
    events: {} as SettingsEvent,
  },
  actions: {
    hydrateFromStorage: assign({
      theme: () => {
        const theme = readInitialTheme()
        applyTheme(theme)
        return theme
      },
      animations: () => {
        const animations = readInitialAnimations()
        applyAnimations(animations)
        return animations
      },
    }),
    persistTheme: ({ context }) => {
      try {
        localStorage.setItem('portfolio-theme', context.theme)
      } catch {
        /* ignore */
      }
      applyTheme(context.theme)
    },
    persistAnimations: ({ context }) => {
      try {
        localStorage.setItem('portfolio-animations', context.animations)
      } catch {
        /* ignore */
      }
      applyAnimations(context.animations)
    },
    assignTheme: assign({
      theme: ({ event }) => (event.type === 'SET_THEME' ? event.theme : 'dark'),
    }),
    assignAnimations: assign({
      animations: ({ event }) => (event.type === 'SET_ANIMATIONS' ? event.animations : 'on'),
    }),
    toggleTheme: assign({
      theme: ({ context }) => (context.theme === 'dark' ? 'light' : 'dark'),
    }),
    toggleAnimations: assign({
      animations: ({ context }) => (context.animations === 'on' ? 'off' : 'on'),
    }),
  },
}).createMachine({
  id: 'settings',
  initial: 'booting',
  context: {
    theme: 'light',
    animations: 'on',
  },
  states: {
    booting: {
      on: {
        HYDRATE: {
          target: 'ready',
          actions: ['hydrateFromStorage'],
        },
      },
    },
    ready: {
      on: {
        SET_THEME: {
          actions: ['assignTheme', 'persistTheme'],
        },
        TOGGLE_THEME: {
          actions: ['toggleTheme', 'persistTheme'],
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

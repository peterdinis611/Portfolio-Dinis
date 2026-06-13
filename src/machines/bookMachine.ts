import { assign, setup } from 'xstate'

const FLIP_MS = 780
const COVER_MS = 1050

export type BookContext = {
  page: number
  totalPages: number
  flipDir: 1 | -1
}

export type BookEvent =
  | { type: 'SET_TOTAL_PAGES'; total: number }
  | { type: 'OPEN' }
  | { type: 'REQUEST_CLOSE' }
  | { type: 'COVER_ANIMATION_DONE' }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GO_TO'; page: number }
  | { type: 'FLIP_DONE' }
  | { type: 'CROSSFADE_DONE' }

export const bookMachine = setup({
  types: {
    context: {} as BookContext,
    events: {} as BookEvent,
  },
  guards: {
    canNext: ({ context }) => context.page < context.totalPages - 2,
    canPrev: ({ context }) => context.page > 0,
    canGoTo: ({ context, event }) => {
      if (event.type !== 'GO_TO') return false
      return event.page >= 0 && event.page < context.totalPages - 1
    },
    goToDifferent: ({ context, event }) => {
      if (event.type !== 'GO_TO') return false
      return event.page !== context.page
    },
    goToForward: ({ context, event }) => {
      if (event.type !== 'GO_TO') return false
      return event.page === context.page + 1
    },
    goToBackward: ({ context, event }) => {
      if (event.type !== 'GO_TO') return false
      return event.page === context.page - 1
    },
  },
  actions: {
    resetOnClose: assign({
      page: 0,
      flipDir: 1,
    }),
    commitFlip: assign({
      page: ({ context }) => context.page + context.flipDir,
    }),
    setPage: assign({
      page: ({ event }) => (event.type === 'GO_TO' ? event.page : 0),
    }),
    setTotalPages: assign({
      totalPages: ({ event }) => (event.type === 'SET_TOTAL_PAGES' ? event.total : 6),
    }),
    setFlipForward: assign({ flipDir: 1 }),
    setFlipBackward: assign({ flipDir: -1 }),
  },
}).createMachine({
  id: 'book',
  initial: 'closed',
  context: {
    page: 0,
    totalPages: 6,
    flipDir: 1,
  },
  on: {
    SET_TOTAL_PAGES: { actions: 'setTotalPages' },
  },
  states: {
    closed: {
      on: {
        OPEN: { target: 'open' },
      },
    },
    open: {
      on: {
        REQUEST_CLOSE: { target: 'closing' },
        NEXT: { target: 'flipping', guard: 'canNext', actions: 'setFlipForward' },
        PREV: { target: 'flipping', guard: 'canPrev', actions: 'setFlipBackward' },
        GO_TO: [
          {
            guard: 'goToForward',
            target: 'flipping',
            actions: 'setFlipForward',
          },
          {
            guard: 'goToBackward',
            target: 'flipping',
            actions: 'setFlipBackward',
          },
          {
            guard: 'goToDifferent',
            target: 'crossfading',
            actions: 'setPage',
          },
        ],
      },
    },
    flipping: {
      on: {
        FLIP_DONE: { target: 'open', actions: 'commitFlip' },
      },
    },
    crossfading: {
      on: {
        CROSSFADE_DONE: { target: 'open' },
      },
      after: {
        420: { target: 'open' },
      },
    },
    closing: {
      on: {
        COVER_ANIMATION_DONE: {
          target: 'closed',
          actions: 'resetOnClose',
        },
      },
    },
  },
})

export const FLIP_DURATION_MS = FLIP_MS
export const COVER_DURATION_MS = COVER_MS
export const COVER_CLOSE_DELAY_MS = 240
export const FLIP_EASE = [0.45, 0.05, 0.22, 1] as const
export const COVER_EASE = [0.55, 0.04, 0.18, 1] as const
export const COVER_CLOSE_EASE = [0.76, 0, 0.24, 1] as const

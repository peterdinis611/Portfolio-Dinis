import { assign, setup } from 'xstate'

const FLIP_MS = 720

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
  },
  actions: {
    resetOnClose: assign({
      page: 0,
      flipDir: 1,
    }),
    incrementPage: assign({
      page: ({ context }) => context.page + 1,
    }),
    decrementPage: assign({
      page: ({ context }) => context.page - 1,
    }),
    setPage: assign({
      page: ({ event }) => (event.type === 'GO_TO' ? event.page : 0),
    }),
    setTotalPages: assign({
      totalPages: ({ event }) => (event.type === 'SET_TOTAL_PAGES' ? event.total : 6),
    }),
    setFlipForward: assign({ flipDir: 1 }),
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
        PREV: { actions: 'decrementPage', guard: 'canPrev' },
        GO_TO: { actions: 'setPage', guard: 'canGoTo' },
      },
    },
    flipping: {
      after: {
        [FLIP_MS]: {
          target: 'open',
          actions: 'incrementPage',
        },
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

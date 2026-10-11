'use client'

import { usePathname } from 'next/navigation'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

/** Wait this long before showing spinner — fast/static navigations stay silent. */
const SHOW_AFTER_MS = 320
/** Once shown, keep visible briefly so it doesn’t flicker off. */
const MIN_VISIBLE_MS = 220
const MAX_PENDING_MS = 8000

type RoutePendingApi = {
  /** True only when a nav is slow enough to warrant UI. */
  showSpinner: boolean
  /** Mark a client navigation as started (NotionLink / router.push). */
  begin: () => void
}

const RoutePendingContext = createContext<RoutePendingApi | null>(null)

export function RoutePendingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [showSpinner, setShowSpinner] = useState(false)
  const navigating = useRef(false)
  const spinnerVisible = useRef(false)
  const shownAt = useRef(0)
  const showTimer = useRef<number | null>(null)
  const hideTimer = useRef<number | null>(null)
  const safetyTimer = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (showTimer.current) {
      window.clearTimeout(showTimer.current)
      showTimer.current = null
    }
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
    if (safetyTimer.current) {
      window.clearTimeout(safetyTimer.current)
      safetyTimer.current = null
    }
  }, [])

  const begin = useCallback(() => {
    clearTimers()
    navigating.current = true
    spinnerVisible.current = false
    shownAt.current = 0
    setShowSpinner(false)

    showTimer.current = window.setTimeout(() => {
      if (!navigating.current) return
      spinnerVisible.current = true
      shownAt.current = performance.now()
      setShowSpinner(true)
      showTimer.current = null
    }, SHOW_AFTER_MS)

    safetyTimer.current = window.setTimeout(() => {
      navigating.current = false
      spinnerVisible.current = false
      setShowSpinner(false)
      safetyTimer.current = null
    }, MAX_PENDING_MS)
  }, [clearTimers])

  const settle = useCallback(() => {
    if (!navigating.current && !spinnerVisible.current) return

    navigating.current = false

    if (showTimer.current) {
      window.clearTimeout(showTimer.current)
      showTimer.current = null
    }
    if (safetyTimer.current) {
      window.clearTimeout(safetyTimer.current)
      safetyTimer.current = null
    }

    // Fast nav — spinner never appeared.
    if (!spinnerVisible.current) {
      setShowSpinner(false)
      return
    }

    const elapsed = shownAt.current ? performance.now() - shownAt.current : 0
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed)
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => {
      spinnerVisible.current = false
      shownAt.current = 0
      setShowSpinner(false)
      hideTimer.current = null
    }, wait)
  }, [])

  useEffect(() => {
    settle()
  }, [pathname, settle])

  useEffect(() => () => clearTimers(), [clearTimers])

  const value = useMemo(() => ({ showSpinner, begin }), [showSpinner, begin])

  return <RoutePendingContext.Provider value={value}>{children}</RoutePendingContext.Provider>
}

export function useRoutePending(): RoutePendingApi {
  const ctx = useContext(RoutePendingContext)
  if (!ctx) {
    return {
      showSpinner: false,
      begin: () => {},
    }
  }
  return ctx
}

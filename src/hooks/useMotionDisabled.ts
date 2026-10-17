'use client'

import { useReducedMotion } from 'framer-motion'
import { useSyncExternalStore } from 'react'

function subscribeAnimations(onStoreChange: () => void) {
  if (typeof document === 'undefined') return () => {}
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-animations'],
  })
  return () => observer.disconnect()
}

function getAnimationsOffSnapshot() {
  return document.documentElement.dataset.animations === 'off'
}

function getAnimationsOffServerSnapshot() {
  return false
}

/**
 * True when OS reduced-motion is on OR user disabled animations
 * (`document.documentElement.dataset.animations === 'off'`).
 * Safe outside Settings/ActorProvider (e.g. `global-error.tsx`).
 */
export function useMotionDisabled() {
  const reduceOs = useReducedMotion()
  const animationsOff = useSyncExternalStore(
    subscribeAnimations,
    getAnimationsOffSnapshot,
    getAnimationsOffServerSnapshot,
  )
  return Boolean(reduceOs) || animationsOff
}

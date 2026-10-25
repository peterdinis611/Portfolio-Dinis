'use client'

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

function subscribePrefersReducedMotion(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

function getPrefersReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getPrefersReducedMotionServerSnapshot() {
  return false
}

/**
 * True when OS reduced-motion is on OR user disabled animations
 * (`document.documentElement.dataset.animations === 'off'`).
 * Safe outside Settings/ActorProvider (e.g. `global-error.tsx`).
 * Both signals use useSyncExternalStore so SSR/hydration stay consistent.
 */
export function useMotionDisabled() {
  const animationsOff = useSyncExternalStore(
    subscribeAnimations,
    getAnimationsOffSnapshot,
    getAnimationsOffServerSnapshot,
  )
  const reduceOs = useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotionSnapshot,
    getPrefersReducedMotionServerSnapshot,
  )
  return reduceOs || animationsOff
}

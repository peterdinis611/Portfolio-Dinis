import confetti, { type Options as ConfettiOptions } from 'canvas-confetti'

const TEAL = ['#18747a', '#7ec8cf', '#0f1c1d', '#f4f7f7', '#e9a800']

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  return document.documentElement.dataset.animations === 'off'
}

/** Burst of teal-branded confetti. No-op when motion is disabled. */
export function celebrateCvAction(originX = 0.5, originY = 0.28) {
  if (prefersReducedMotion()) return

  const fire = (opts: ConfettiOptions) =>
    confetti({
      ...opts,
      colors: TEAL,
      disableForReducedMotion: true,
      zIndex: 2147483000,
    })

  void fire({
    particleCount: 70,
    spread: 62,
    startVelocity: 38,
    origin: { x: originX, y: originY },
    scalar: 0.95,
  })

  window.setTimeout(() => {
    void fire({
      particleCount: 40,
      spread: 100,
      startVelocity: 28,
      origin: { x: originX - 0.18, y: originY + 0.05 },
      scalar: 0.85,
    })
    void fire({
      particleCount: 40,
      spread: 100,
      startVelocity: 28,
      origin: { x: originX + 0.18, y: originY + 0.05 },
      scalar: 0.85,
    })
  }, 140)
}

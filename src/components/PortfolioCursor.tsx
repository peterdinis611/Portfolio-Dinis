import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'
import { cn } from '@/lib/utils'

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="pointer"], .notion-gallery-card, .tech-chip, .notion-nav-item, .notion-adjacent, .notion-page-link'

function playClickSound(audioCtx: AudioContext) {
  const t0 = audioCtx.currentTime

  // Soft mechanical / UI click — layered tone + noise tick
  const osc = audioCtx.createOscillator()
  const oscGain = audioCtx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(920, t0)
  osc.frequency.exponentialRampToValueAtTime(180, t0 + 0.055)
  oscGain.gain.setValueAtTime(0.0001, t0)
  oscGain.gain.exponentialRampToValueAtTime(0.085, t0 + 0.004)
  oscGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.07)
  osc.connect(oscGain)
  oscGain.connect(audioCtx.destination)
  osc.start(t0)
  osc.stop(t0 + 0.08)

  const bufferSize = Math.floor(audioCtx.sampleRate * 0.025)
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }
  const noise = audioCtx.createBufferSource()
  const noiseFilter = audioCtx.createBiquadFilter()
  const noiseGain = audioCtx.createGain()
  noise.buffer = noiseBuffer
  noiseFilter.type = 'highpass'
  noiseFilter.frequency.value = 1400
  noiseGain.gain.setValueAtTime(0.045, t0)
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.03)
  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(audioCtx.destination)
  noise.start(t0)
  noise.stop(t0 + 0.035)
}

function CursorArrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      role="presentation"
      focusable="false"
      aria-hidden
    >
      <path
        className="portfolio-cursor-arrow-shadow"
        d="M5.2 3.1 5.2 18.4 9.4 14.6 12.5 21.4 15.4 20.2 12.1 13.1 18.6 13.1Z"
      />
      <path
        className="portfolio-cursor-arrow-fill"
        d="M5.2 3.1 5.2 18.4 9.4 14.6 12.5 21.4 15.4 20.2 12.1 13.1 18.6 13.1Z"
      />
      <path
        className="portfolio-cursor-arrow-stroke"
        d="M5.2 3.1 5.2 18.4 9.4 14.6 12.5 21.4 15.4 20.2 12.1 13.1 18.6 13.1Z"
      />
    </svg>
  )
}

export function PortfolioCursor() {
  const disabledMotion = useMotionDisabled()
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [visible, setVisible] = useState(false)
  const audioRef = useRef<AudioContext | null>(null)

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  const springConfig = disabledMotion
    ? { stiffness: 1000, damping: 100, mass: 0.1 }
    : { stiffness: 560, damping: 38, mass: 0.22 }

  const x = useSpring(rawX, springConfig)
  const y = useSpring(rawY, springConfig)

  const ensureAudio = useCallback(() => {
    if (typeof window === 'undefined') return null
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return null
    if (!audioRef.current || audioRef.current.state === 'closed') {
      audioRef.current = new Ctx()
    }
    return audioRef.current
  }, [])

  const click = useCallback(() => {
    const ctx = ensureAudio()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      void ctx.resume().then(() => playClickSound(ctx))
      return
    }
    playClickSound(ctx)
  }, [ensureAudio])

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      const ok = fine.matches && !reduce.matches
      setActive(ok)
      document.documentElement.classList.toggle('has-custom-cursor', ok)
    }

    sync()
    fine.addEventListener('change', sync)
    reduce.addEventListener('change', sync)
    return () => {
      fine.removeEventListener('change', sync)
      reduce.removeEventListener('change', sync)
      document.documentElement.classList.remove('has-custom-cursor')
      void audioRef.current?.close()
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!active) return

    const onMove = (event: MouseEvent) => {
      rawX.set(event.clientX)
      rawY.set(event.clientY)
      setVisible(true)

      const target = event.target
      if (!(target instanceof Element)) {
        setHover(false)
        return
      }
      setHover(Boolean(target.closest(INTERACTIVE)))
    }

    const onDown = (event: MouseEvent) => {
      if (event.button !== 0) return
      setPressed(true)
      click()
    }
    const onUp = () => setPressed(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [active, rawX, rawY, click])

  if (!active) return null

  const spring = disabledMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 480, damping: 30, mass: 0.3 }

  return (
    <div className="portfolio-cursor" aria-hidden>
      <motion.div
        className={cn('portfolio-cursor-pointer', hover && 'is-hover', pressed && 'is-pressed')}
        style={{ x, y }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.86 : hover ? 1.12 : 1,
          rotate: pressed ? -4 : hover ? -2 : 0,
        }}
        transition={spring}
      >
        <CursorArrow />
        <span className={cn('portfolio-cursor-ring-hint', hover && 'is-visible')} />
      </motion.div>
    </div>
  )
}

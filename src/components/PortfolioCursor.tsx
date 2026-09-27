import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'
import { cn } from '@/lib/utils'

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="pointer"], .notion-gallery-card, .tech-chip, .notion-nav-item, .notion-adjacent, .notion-page-link'

function playClickSound(audioCtx: AudioContext) {
  const t0 = audioCtx.currentTime

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

function CursorArrow() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      role="presentation"
      focusable="false"
      aria-hidden
    >
      {/* Soft drop shadow */}
      <path
        d="M6 3.5v18.2l4.6-4.2 3.4 7.5 3.2-1.35-3.55-7.7H22Z"
        fill="rgba(0,0,0,0.28)"
        transform="translate(1.2 1.4)"
      />
      {/* High-contrast PC arrow */}
      <path
        d="M6 3.5v18.2l4.6-4.2 3.4 7.5 3.2-1.35-3.55-7.7H22Z"
        fill="#111111"
        stroke="#ffffff"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {/* Teal tip accent */}
      <path d="M6 3.5 10.2 16.2 6 21.7Z" fill="var(--primary)" opacity="0.95" />
    </svg>
  )
}

export function PortfolioCursor() {
  const disabledMotion = useMotionDisabled()
  const [enabled, setEnabled] = useState(false)
  const [hover, setHover] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [ready, setReady] = useState(false)
  const readyRef = useRef(false)
  const audioRef = useRef<AudioContext | null>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const springConfig = disabledMotion
    ? { stiffness: 2000, damping: 80, mass: 0.01 }
    : { stiffness: 700, damping: 40, mass: 0.18 }

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

    const sync = () => {
      setEnabled(fine.matches)
    }

    sync()
    fine.addEventListener('change', sync)
    return () => {
      fine.removeEventListener('change', sync)
      document.documentElement.classList.remove('has-custom-cursor')
      void audioRef.current?.close()
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('has-custom-cursor')
      readyRef.current = false
      setReady(false)
      return
    }

    const onMove = (event: MouseEvent) => {
      rawX.set(event.clientX)
      rawY.set(event.clientY)

      if (!readyRef.current) {
        readyRef.current = true
        setReady(true)
        document.documentElement.classList.add('has-custom-cursor')
      }

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

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [enabled, rawX, rawY, click])

  if (!enabled || !ready) return null

  const spring = disabledMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 520, damping: 32, mass: 0.28 }

  return (
    <div className="portfolio-cursor" aria-hidden>
      <motion.div
        className={cn('portfolio-cursor-pointer', hover && 'is-hover', pressed && 'is-pressed')}
        style={{ x, y }}
        animate={{
          scale: pressed ? 0.88 : hover ? 1.1 : 1,
          rotate: pressed ? -6 : hover ? -3 : 0,
        }}
        transition={spring}
      >
        <CursorArrow />
        <span className={cn('portfolio-cursor-ring-hint', hover && 'is-visible')} />
      </motion.div>
    </div>
  )
}

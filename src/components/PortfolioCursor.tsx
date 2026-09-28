import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'
import { cn } from '@/lib/utils'

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="pointer"], .notion-gallery-card, .tech-chip, .notion-nav-item, .notion-adjacent, .notion-page-link, .cv-chip'

/** Arrow tip hotspot in the 28×28 SVG. */
const HOTSPOT_X = 6
const HOTSPOT_Y = 3.5

function playClickSound(audioCtx: AudioContext) {
  const t0 = audioCtx.currentTime

  const osc = audioCtx.createOscillator()
  const oscGain = audioCtx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(880, t0)
  osc.frequency.exponentialRampToValueAtTime(220, t0 + 0.045)
  oscGain.gain.setValueAtTime(0.0001, t0)
  oscGain.gain.exponentialRampToValueAtTime(0.055, t0 + 0.003)
  oscGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.055)
  osc.connect(oscGain)
  oscGain.connect(audioCtx.destination)
  osc.start(t0)
  osc.stop(t0 + 0.06)

  const bufferSize = Math.floor(audioCtx.sampleRate * 0.018)
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
  noiseFilter.frequency.value = 1600
  noiseGain.gain.setValueAtTime(0.028, t0)
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.022)
  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(audioCtx.destination)
  noise.start(t0)
  noise.stop(t0 + 0.025)
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
      <path
        d="M6 3.5v18.2l4.6-4.2 3.4 7.5 3.2-1.35-3.55-7.7H22Z"
        fill="rgba(0,0,0,0.22)"
        transform="translate(1 1.2)"
      />
      <path
        d="M6 3.5v18.2l4.6-4.2 3.4 7.5 3.2-1.35-3.55-7.7H22Z"
        fill="#111111"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M6 3.5 10.2 16.2 6 21.7Z" fill="var(--primary)" opacity="0.95" />
    </svg>
  )
}

export function PortfolioCursor() {
  const disabledMotion = useMotionDisabled()
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hover, setHover] = useState(false)
  const [pressed, setPressed] = useState(false)

  const pointerRef = useRef<HTMLDivElement>(null)
  const hoverRef = useRef(false)
  const visibleRef = useRef(false)
  const rafRef = useRef(0)
  const pendingRef = useRef<{ x: number; y: number } | null>(null)
  const audioRef = useRef<AudioContext | null>(null)
  const lastClickRef = useRef(0)

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
    const now = performance.now()
    if (now - lastClickRef.current < 90) return
    lastClickRef.current = now

    const ctx = ensureAudio()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      void ctx.resume().then(() => playClickSound(ctx))
      return
    }
    playClickSound(ctx)
  }, [ensureAudio])

  const flushPosition = useCallback(() => {
    rafRef.current = 0
    const pending = pendingRef.current
    const el = pointerRef.current
    if (!pending || !el) return
    el.style.left = `${pending.x - HOTSPOT_X}px`
    el.style.top = `${pending.y - HOTSPOT_Y}px`
  }, [])

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const sync = () => setEnabled(fine.matches)
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
      visibleRef.current = false
      setVisible(false)
      return
    }

    const show = () => {
      if (visibleRef.current) return
      visibleRef.current = true
      setVisible(true)
      document.documentElement.classList.add('has-custom-cursor')
    }

    const hide = () => {
      if (!visibleRef.current) return
      visibleRef.current = false
      setVisible(false)
      hoverRef.current = false
      setHover(false)
      setPressed(false)
      document.documentElement.classList.remove('has-custom-cursor')
    }

    const onMove = (event: MouseEvent) => {
      pendingRef.current = { x: event.clientX, y: event.clientY }
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(flushPosition)
      }

      show()

      const target = event.target
      const nextHover = target instanceof Element ? Boolean(target.closest(INTERACTIVE)) : false
      if (nextHover !== hoverRef.current) {
        hoverRef.current = nextHover
        setHover(nextHover)
      }
    }

    const onDown = (event: MouseEvent) => {
      if (event.button !== 0) return
      setPressed(true)
      const target = event.target
      if (target instanceof Element && target.closest(INTERACTIVE)) {
        click()
      }
    }
    const onUp = () => setPressed(false)
    const onLeave = () => hide()
    const onEnter = (event: MouseEvent) => {
      pendingRef.current = { x: event.clientX, y: event.clientY }
      flushPosition()
      show()
    }

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
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [enabled, click, flushPosition])

  if (!enabled) return null

  return (
    <div className={cn('portfolio-cursor', !visible && 'is-hidden')} aria-hidden>
      <div
        ref={pointerRef}
        className={cn(
          'portfolio-cursor-pointer',
          hover && 'is-hover',
          pressed && 'is-pressed',
          disabledMotion && 'is-instant',
        )}
      >
        <CursorArrow />
        <span className={cn('portfolio-cursor-ring-hint', hover && 'is-visible')} />
      </div>
    </div>
  )
}

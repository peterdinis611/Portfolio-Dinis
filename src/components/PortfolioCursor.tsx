import { useEffect, useRef, useState } from 'react'
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
  const [active, setActive] = useState(false)
  const [hover, setHover] = useState(false)
  const [pressed, setPressed] = useState(false)

  const pointerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(false)
  const hoverRef = useRef(false)
  const audioRef = useRef<AudioContext | null>(null)
  const lastClickRef = useRef(0)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    if (!fine.matches) return

    const place = (x: number, y: number) => {
      const el = pointerRef.current
      if (!el) return false
      // Position via left/top so CSS can still use transform for hover scale.
      el.style.left = `${x - HOTSPOT_X}px`
      el.style.top = `${y - HOTSPOT_Y}px`
      return true
    }

    const activate = (x: number, y: number) => {
      if (!place(x, y)) return
      if (activeRef.current) return
      activeRef.current = true
      // Hide native cursor only after custom pointer is positioned.
      document.documentElement.classList.add('has-custom-cursor')
      setActive(true)
    }

    const deactivate = () => {
      if (!activeRef.current) return
      activeRef.current = false
      hoverRef.current = false
      setActive(false)
      setHover(false)
      setPressed(false)
      document.documentElement.classList.remove('has-custom-cursor')
    }

    const ensureAudio = () => {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!Ctx) return null
      if (!audioRef.current || audioRef.current.state === 'closed') {
        audioRef.current = new Ctx()
      }
      return audioRef.current
    }

    const playClick = () => {
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
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      place(event.clientX, event.clientY)
      activate(event.clientX, event.clientY)

      const target = event.target
      const nextHover = target instanceof Element ? Boolean(target.closest(INTERACTIVE)) : false
      if (nextHover !== hoverRef.current) {
        hoverRef.current = nextHover
        setHover(nextHover)
      }
    }

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || event.button !== 0) return
      setPressed(true)
      const target = event.target
      if (target instanceof Element && target.closest(INTERACTIVE)) {
        playClick()
      }
    }

    const onUp = () => setPressed(false)

    const onLeaveWindow = (event: MouseEvent) => {
      const related = event.relatedTarget
      if (related instanceof Node && document.documentElement.contains(related)) return
      deactivate()
    }

    const onVisibility = () => {
      if (document.hidden) deactivate()
    }

    const onFineChange = () => {
      if (!fine.matches) deactivate()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    document.addEventListener('mouseout', onLeaveWindow)
    document.addEventListener('visibilitychange', onVisibility)
    fine.addEventListener('change', onFineChange)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      document.removeEventListener('mouseout', onLeaveWindow)
      document.removeEventListener('visibilitychange', onVisibility)
      fine.removeEventListener('change', onFineChange)
      document.documentElement.classList.remove('has-custom-cursor')
      void audioRef.current?.close()
      audioRef.current = null
    }
  }, [])

  return (
    <div className={cn('portfolio-cursor', !active && 'is-hidden')} aria-hidden>
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

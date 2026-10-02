import { useEffect, useState } from 'react'

/** Thin reading progress bar pinned to the scroll pane top. */
export function NoteReadingProgress({
  targetId = 'main-content',
  accent,
}: {
  targetId?: string
  accent?: string
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const pane = document.getElementById(targetId)
    if (!pane) return

    const onScroll = () => {
      const max = pane.scrollHeight - pane.clientHeight
      if (max <= 0) {
        setProgress(0)
        return
      }
      setProgress(Math.min(1, Math.max(0, pane.scrollTop / max)))
    }

    onScroll()
    pane.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      pane.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [targetId])

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 left-0 z-[40] h-[2px] md:left-[var(--sidebar-w,0px)]"
      aria-hidden
    >
      <div
        className="h-full origin-left transition-[width] duration-75 ease-out"
        style={{
          width: `${progress * 100}%`,
          background: accent ?? 'var(--primary)',
        }}
      />
    </div>
  )
}

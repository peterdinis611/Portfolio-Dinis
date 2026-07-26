import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { type Lang, translations } from '@/i18n/translations'
import { cn } from '@/lib/utils'

const SCROLL_THRESHOLD = 320

type ScrollToTopProps = {
  lang: Lang
  targetId?: string
  className?: string
}

export function ScrollToTop({
  lang,
  targetId = 'main-content',
  className,
}: ScrollToTopProps) {
  const [visible, setVisible] = useState(false)
  const label = translations[lang].ui.scrollToTop

  useEffect(() => {
    const pane = document.getElementById(targetId)
    if (!pane) return

    const onScroll = () => {
      setVisible(pane.scrollTop > SCROLL_THRESHOLD)
    }

    onScroll()
    pane.addEventListener('scroll', onScroll, { passive: true })
    return () => pane.removeEventListener('scroll', onScroll)
  }, [targetId])

  const scrollToTop = () => {
    const pane = document.getElementById(targetId)
    if (!pane) return
    pane.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      aria-label={label}
      title={label}
      className={cn(
        'fixed right-4 bottom-4 z-30 h-10 w-10 rounded-full border-[rgba(55,53,47,0.12)] bg-background/95 text-foreground shadow-[0_8px_24px_-12px_rgba(15,15,15,0.45)] backdrop-blur-sm transition-[opacity,transform] hover:bg-[rgba(55,53,47,0.06)] dark:border-[rgba(255,255,255,0.12)] dark:hover:bg-[rgba(255,255,255,0.08)] sm:right-6 sm:bottom-6',
        visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        className,
      )}
    >
      <ArrowUp className="h-4 w-4" strokeWidth={2} />
    </Button>
  )
}

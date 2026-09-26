import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'
import { type Lang, translations } from '@/i18n/translations'
import { cn } from '@/lib/utils'
import { MOTION_EASE } from './motion'

const SCROLL_THRESHOLD = 320

type ScrollToTopProps = {
  lang: Lang
  targetId?: string
  className?: string
}

export function ScrollToTop({ lang, targetId = 'main-content', className }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false)
  const label = translations[lang].ui.scrollToTop
  const reduce = useMotionDisabled()

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
    pane.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className={cn('fixed right-4 bottom-4 z-30 sm:right-6 sm:bottom-6', className)}
          initial={reduce ? false : { opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.94 }}
          transition={{ duration: 0.28, ease: MOTION_EASE }}
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            aria-label={label}
            title={label}
            className="h-10 w-10 rounded-full border-[rgba(55,53,47,0.12)] bg-background/95 text-foreground shadow-[0_8px_24px_-12px_rgba(15,15,15,0.45)] backdrop-blur-sm transition-[background-color,transform] hover:scale-105 hover:bg-[rgba(55,53,47,0.06)] dark:border-[rgba(255,255,255,0.12)] dark:hover:bg-[rgba(255,255,255,0.08)]"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2} />
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

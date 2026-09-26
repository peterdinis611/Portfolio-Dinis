import { motion } from 'framer-motion'
import { ProfilePhoto } from '@/components/ui/ProfilePhoto'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'
import { type Lang, translations } from '@/i18n/translations'

type PreloadScreenProps = {
  progress?: number
  lang?: Lang
}

function getStoredLang(): Lang {
  try {
    return localStorage.getItem('portfolio-lang') === 'en' ? 'en' : 'sk'
  } catch {
    return 'sk'
  }
}

export function PreloadScreen({ progress = 0, lang }: PreloadScreenProps) {
  const resolvedLang = lang ?? getStoredLang()
  const ui = translations[resolvedLang].ui
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100)
  const hasProgress = progress > 0
  const reduce = useMotionDisabled()

  const label = pct >= 100 ? ui.preloadDone : ui.preloadLoading

  return (
    <div className="preload" role="status" aria-live="polite" aria-label={ui.preloadAria}>
      <div className="preload-backdrop" aria-hidden />

      <motion.div
        className="preload-panel"
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="preload-avatar-ring" aria-hidden>
          <ProfilePhoto className="preload-avatar" priority />
        </div>

        <h1 className="preload-name">Peter Dinis</h1>
        <p className="preload-role">{ui.preloadRole}</p>

        <div className="preload-progress">
          <div className="preload-progress-head">
            <p className="preload-label">{label}</p>
            {hasProgress ? (
              <span className="preload-pct" aria-hidden>
                {pct}%
              </span>
            ) : null}
          </div>

          <div className="preload-bar" aria-hidden>
            <motion.div
              className="preload-bar-fill"
              initial={{ width: '0%' }}
              animate={{ width: hasProgress ? `${pct}%` : reduce ? '42%' : '36%' }}
              transition={
                hasProgress || reduce
                  ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 1.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
              }
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

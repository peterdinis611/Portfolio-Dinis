import { motion } from 'framer-motion'
import { ProfilePhoto } from '@/components/ui/ProfilePhoto'

type PreloadScreenProps = {
  progress?: number
}

function getLang(): 'sk' | 'en' {
  try {
    return localStorage.getItem('portfolio-lang') === 'en' ? 'en' : 'sk'
  } catch {
    return 'sk'
  }
}

const copy = {
  sk: {
    role: 'Medior Full-Stack Developer',
    loading: 'Načítavam portfólio…',
    done: 'Hotovo',
  },
  en: {
    role: 'Medior Full-Stack Developer',
    loading: 'Loading portfolio…',
    done: 'Ready',
  },
} as const

export function PreloadScreen({ progress = 0 }: PreloadScreenProps) {
  const lang = getLang()
  const t = copy[lang]
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100)
  const hasProgress = progress > 0

  const label = pct >= 100 ? t.done : t.loading

  return (
    <div className="preload" role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className="preload-backdrop" aria-hidden />

      <motion.div
        className="preload-panel"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="preload-avatar-ring" aria-hidden>
          <ProfilePhoto className="preload-avatar" priority />
        </div>

        <h1 className="preload-name">Peter Dinis</h1>
        <p className="preload-role">{t.role}</p>

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
              animate={{ width: hasProgress ? `${pct}%` : '36%' }}
              transition={
                hasProgress
                  ? { duration: 0.35, ease: [0.32, 0.72, 0, 1] }
                  : { duration: 1.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
              }
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

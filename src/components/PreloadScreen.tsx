import { motion } from 'framer-motion'

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
    loading: 'Načítavam portfólio…',
    loadingPct: (n: number) => `Načítavam… ${n}%`,
    done: 'Hotovo',
  },
  en: {
    loading: 'Loading portfolio…',
    loadingPct: (n: number) => `Loading… ${n}%`,
    done: 'Ready',
  },
} as const

export function PreloadScreen({ progress = 0 }: PreloadScreenProps) {
  const lang = getLang()
  const t = copy[lang]
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100)
  const hasProgress = progress > 0

  const label = hasProgress && pct < 100 ? t.loadingPct(pct) : pct >= 100 ? t.done : t.loading

  return (
    <div className="preload" role="status" aria-live="polite" aria-label="Loading portfolio">
      <motion.div
        className="preload-mark"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      >
        <span className="preload-mark-icon" aria-hidden>
          🧑‍💻
        </span>
        <span>Peter Dinis</span>
      </motion.div>

      <div className="preload-bar" aria-hidden>
        <motion.div
          className="preload-bar-fill"
          initial={{ width: '0%' }}
          animate={{ width: hasProgress ? `${pct}%` : '40%' }}
          transition={
            hasProgress
              ? { duration: 0.35, ease: [0.32, 0.72, 0, 1] }
              : { duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
          }
        />
      </div>

      <p className="preload-label">{label}</p>
    </div>
  )
}

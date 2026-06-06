import { motion } from 'framer-motion'
import { profile, projects } from '../../data/portfolio'
import { translations } from '../../i18n/translations'
import { BookContext, SettingsContext } from '../../context/AppProviders'

const EASE = [0.32, 0.72, 0, 1] as const
const CHAPTER_COUNT = 5

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: EASE },
})

export function BookFinale() {
  const bookActor = BookContext.useActorRef()
  const lang = SettingsContext.useSelector((s) => s.context.lang)
  const ui = translations[lang].ui

  return (
    <div className="book-finale">
      <motion.div className="book-finale-top" {...fadeUp(0.05)}>
        <p className="book-finale-label">{ui.endLabel}</p>
        <div className="book-finale-ornament" aria-hidden>
          <span className="book-finale-ornament-line" />
          <span className="book-finale-ornament-mark">✦</span>
          <span className="book-finale-ornament-line" />
        </div>
        <h2 className="book-finale-title">{ui.endTitle}</h2>
        <p className="book-finale-subtitle">{ui.endSubtitle}</p>
      </motion.div>

      <motion.div className="book-finale-stats" {...fadeUp(0.15)}>
        <div className="book-finale-stat">
          <span className="book-finale-stat-value">{CHAPTER_COUNT}</span>
          <span className="book-finale-stat-label">{ui.endStatLabel}</span>
        </div>
        <div className="book-finale-stat-divider" aria-hidden />
        <div className="book-finale-stat">
          <span className="book-finale-stat-value">{projects.length}</span>
          <span className="book-finale-stat-label">{ui.endStatProjects}</span>
        </div>
      </motion.div>

      <motion.div className="book-finale-middle" {...fadeUp(0.25)}>
        <p className="book-finale-invite">{ui.endInvite}</p>
        <a className="book-finale-btn book-finale-btn--primary" href={`mailto:${profile.email}`}>
          {ui.endCta}
        </a>
      </motion.div>

      <motion.div className="book-finale-bottom" {...fadeUp(0.35)}>
        <div className="book-finale-actions">
          <button
            type="button"
            className="book-finale-btn"
            onClick={() => bookActor.send({ type: 'GO_TO', page: 0 })}
          >
            {ui.readAgain}
          </button>
          <button
            type="button"
            className="book-finale-btn"
            onClick={() => bookActor.send({ type: 'REQUEST_CLOSE' })}
          >
            {ui.closeBook}
          </button>
        </div>

        <p className="book-finale-signature">— {profile.name}</p>
        <footer className="book-finale-colophon">
          {profile.name} · 2026 · {ui.madeWith}
        </footer>
      </motion.div>
    </div>
  )
}

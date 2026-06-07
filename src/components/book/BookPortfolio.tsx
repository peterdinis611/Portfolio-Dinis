import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { BookContext, SettingsContext } from '../../context/AppProviders'
import { profile } from '../../data/portfolio'
import { translations } from '../../i18n/translations'
import { FLIP_DURATION_MS } from '../../machines/bookMachine'
import { BookCoverContent } from './BookCoverContent'
import { BookPageContent } from './BookPageContent'
import { getBookPages } from './pages'

const EASE = [0.32, 0.72, 0, 1] as const

export function BookPortfolio() {
  const bookActor = BookContext.useActorRef()
  const settingsActor = SettingsContext.useActorRef()

  const bookState = BookContext.useSelector((s) => s.value)
  const page = BookContext.useSelector((s) => s.context.page)
  const flipDir = BookContext.useSelector((s) => s.context.flipDir)

  const lang = SettingsContext.useSelector((s) => s.context.lang)
  const theme = SettingsContext.useSelector((s) => s.context.theme)

  const [coverFolded, setCoverFolded] = useState(false)

  const isClosed = bookState === 'closed'
  const isClosing = bookState === 'closing'
  const isOpen = bookState === 'open' || bookState === 'flipping'
  const isFlipping = bookState === 'flipping'
  const isExpanded = !isClosed
  const coverOpen = isOpen
  const showLanding = isClosed

  const ui = translations[lang].ui
  const bookPages = useMemo(() => getBookPages(lang), [lang])

  const total = bookPages.length
  const leftPage = bookPages[page]
  const rightPage = bookPages[page + 1]
  const canPrev = page > 0
  const canNext = page < total - 2
  const isFinaleSpread = rightPage?.id === 'finale' || leftPage?.id === 'finale'
  const progress = Math.round(((page + 2) / total) * 100)
  const currentChapter = rightPage?.title ?? leftPage?.title ?? ''

  useEffect(() => {
    bookActor.send({ type: 'SET_TOTAL_PAGES', total })
  }, [bookActor, total])

  useEffect(() => {
    if (isClosed) setCoverFolded(false)
  }, [isClosed])

  useEffect(() => {
    if (isClosing) setCoverFolded(false)
  }, [isClosing])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isClosed) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          bookActor.send({ type: 'OPEN' })
        }
        return
      }
      if (isClosing) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') bookActor.send({ type: 'NEXT' })
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') bookActor.send({ type: 'PREV' })
      if (e.key === 'Escape') bookActor.send({ type: 'REQUEST_CLOSE' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [bookActor, isClosed, isClosing])

  const handleCoverAnimDone = () => {
    if (isClosing) {
      bookActor.send({ type: 'COVER_ANIMATION_DONE' })
      return
    }
    if (coverOpen) setCoverFolded(true)
  }

  return (
    <div className={`book-app ${showLanding ? 'book-app--landing' : ''}`}>
      {showLanding ? (
        <div className="book-floating-controls">
          <div className="book-segment" role="group" aria-label="Language">
            <button
              type="button"
              className={`book-segment-btn ${lang === 'sk' ? 'active' : ''}`}
              onClick={() => settingsActor.send({ type: 'SET_LANG', lang: 'sk' })}
            >
              {ui.langSk}
            </button>
            <button
              type="button"
              className={`book-segment-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => settingsActor.send({ type: 'SET_LANG', lang: 'en' })}
            >
              {ui.langEn}
            </button>
          </div>
          <button
            type="button"
            className="book-icon-btn"
            onClick={() => settingsActor.send({ type: 'TOGGLE_THEME' })}
            aria-label={theme === 'dark' ? ui.themeLight : ui.themeDark}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      ) : (
        <header className="book-app-header">
          <div className="book-app-header-left">
            <span className="book-app-brand">{profile.name}</span>
            {coverOpen && <span className="book-app-chapter">{currentChapter}</span>}
          </div>

          <div className="book-app-controls">
            <div className="book-segment" role="group" aria-label="Language">
              <button
                type="button"
                className={`book-segment-btn ${lang === 'sk' ? 'active' : ''}`}
                onClick={() => settingsActor.send({ type: 'SET_LANG', lang: 'sk' })}
              >
                {ui.langSk}
              </button>
              <button
                type="button"
                className={`book-segment-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => settingsActor.send({ type: 'SET_LANG', lang: 'en' })}
              >
                {ui.langEn}
              </button>
            </div>

            <button
              type="button"
              className="book-icon-btn"
              onClick={() => settingsActor.send({ type: 'TOGGLE_THEME' })}
              aria-label={theme === 'dark' ? ui.themeLight : ui.themeDark}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </header>
      )}

      {coverOpen && (
        <div className="book-progress-bar" aria-hidden>
          <motion.div
            className="book-progress-bar-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
      )}

      <div className="book-viewport" id="main-content">
        <div className={`book-stage ${isExpanded ? 'book-stage--open' : ''}`}>
          <motion.div
            className={[
              'book',
              isExpanded ? 'book--expanded' : '',
              isClosing ? 'book--closing' : '',
              coverFolded ? 'book--cover-folded' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            layout
            transition={{ duration: 0.85, ease: EASE }}
          >
            <div className="book-shadow" aria-hidden />
            <div className="book-back" aria-hidden />

            <motion.div
              className={`book-spread ${isExpanded ? 'book-spread--show' : ''}`}
              initial={false}
              animate={{ opacity: isExpanded ? 1 : 0, scale: isExpanded ? 1 : 0.98 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div
                className={`book-page book-page--left ${canPrev ? 'can-click' : ''}`}
                onClick={
                  canPrev && !isFlipping ? () => bookActor.send({ type: 'PREV' }) : undefined
                }
              >
                <AnimatePresence mode="wait">
                  {leftPage && (
                    <motion.div
                      key={`left-${page}-${leftPage.id}`}
                      className="book-page-motion"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <BookPageContent page={leftPage} side="left" pageNum={page + 1} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="book-spine-line" aria-hidden />

              <div
                className={`book-page book-page--right ${canNext ? 'can-click' : ''}`}
                onClick={
                  canNext && !isFlipping ? () => bookActor.send({ type: 'NEXT' }) : undefined
                }
              >
                {isFlipping && flipDir === 1 && bookPages[page + 2] && (
                  <div className="book-page-under">
                    <BookPageContent page={bookPages[page + 2]!} side="right" pageNum={page + 3} />
                  </div>
                )}

                <motion.div
                  className="book-flipper"
                  animate={{ rotateY: isFlipping && flipDir === 1 ? -180 : 0 }}
                  transition={{ duration: FLIP_DURATION_MS / 1000, ease: EASE }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="book-flip-front">
                    <AnimatePresence mode="wait">
                      {rightPage && (
                        <motion.div
                          key={`right-${page}-${rightPage.id}`}
                          className="book-page-motion"
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.35, ease: EASE }}
                        >
                          <BookPageContent page={rightPage} side="right" pageNum={page + 2} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="book-flip-back">
                    <div className="book-sheet book-sheet--blank" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.button
              type="button"
              className={`book-cover ${coverFolded ? 'book-cover--hidden' : ''}`}
              onClick={() =>
                coverOpen
                  ? bookActor.send({ type: 'REQUEST_CLOSE' })
                  : bookActor.send({ type: 'OPEN' })
              }
              animate={{ rotateY: coverOpen ? -180 : 0 }}
              transition={{ duration: 0.85, ease: EASE }}
              onAnimationComplete={handleCoverAnimDone}
              aria-label={coverOpen ? ui.closeAria : ui.openAria}
              aria-hidden={coverFolded}
              tabIndex={coverFolded ? -1 : 0}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="book-cover-face book-cover-front">
                <BookCoverContent
                  lang={lang}
                  ctaLabel={isClosing ? ui.closing : coverOpen ? ui.close : ui.openBook}
                  showHint={!coverOpen && !isClosing}
                />
              </div>
              <div className="book-cover-face book-cover-inside" aria-hidden />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {coverOpen && (
        <motion.footer
          className="book-toolbar"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <button
            type="button"
            className="book-nav-btn"
            onClick={() => bookActor.send({ type: 'PREV' })}
            disabled={!canPrev || isFlipping}
            aria-label={ui.back}
          >
            ←
          </button>

          <div className="book-toolbar-main">
            <div className="book-toolbar-dots">
              {Array.from({ length: total - 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`book-dot ${i === page ? 'active' : ''}`}
                  onClick={() => bookActor.send({ type: 'GO_TO', page: i })}
                  aria-label={`${ui.spread} ${i + 1}`}
                />
              ))}
            </div>
            <span className="book-toolbar-count">
              {page + 1}–{Math.min(page + 2, total)} / {total}
            </span>
          </div>

          {isFinaleSpread ? (
            <button
              type="button"
              className="book-nav-btn book-nav-btn--text"
              onClick={() => bookActor.send({ type: 'GO_TO', page: 0 })}
            >
              {ui.readAgain}
            </button>
          ) : (
            <button
              type="button"
              className="book-nav-btn"
              onClick={() => bookActor.send({ type: 'NEXT' })}
              disabled={!canNext || isFlipping}
              aria-label={ui.next}
            >
              →
            </button>
          )}

          <button
            type="button"
            className="book-nav-btn book-nav-btn--ghost"
            onClick={() => bookActor.send({ type: 'REQUEST_CLOSE' })}
          >
            {ui.close}
          </button>
        </motion.footer>
      )}
    </div>
  )
}

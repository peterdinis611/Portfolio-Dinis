import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { BookContext, SettingsContext } from '../../context/AppProviders'
import { profile } from '../../data/portfolio'
import { translations } from '../../i18n/translations'
import {
  COVER_CLOSE_DELAY_MS,
  COVER_CLOSE_EASE,
  COVER_DURATION_MS,
  COVER_EASE,
} from '../../machines/bookMachine'
import { BookCoverContent } from './BookCoverContent'
import { BookSpread } from './BookSpread'
import { ThemeToggleIcon } from '../icons/ThemeToggleIcon'
import { getBookPages } from './pages'

const EASE = [0.32, 0.72, 0, 1] as const
const COVER_S = COVER_DURATION_MS / 1000
const COVER_CLOSE_S = (COVER_DURATION_MS + 80) / 1000

export function BookPortfolio() {
  const bookActor = BookContext.useActorRef()
  const settingsActor = SettingsContext.useActorRef()

  const bookState = BookContext.useSelector((s) => s.value)
  const page = BookContext.useSelector((s) => s.context.page)
  const flipDir = BookContext.useSelector((s) => s.context.flipDir)

  const lang = SettingsContext.useSelector((s) => s.context.lang)
  const theme = SettingsContext.useSelector((s) => s.context.theme)

  const [coverParked, setCoverParked] = useState(false)
  const [closingFlip, setClosingFlip] = useState(false)

  const isClosed = bookState === 'closed'
  const isClosing = bookState === 'closing'
  const isReading =
    bookState === 'open' || bookState === 'flipping' || bookState === 'crossfading'
  const isOpen = isReading
  const isFlipping = bookState === 'flipping'
  const isCrossfading = bookState === 'crossfading'
  const isTransitioning = isFlipping || isCrossfading
  const isExpanded = !isClosed
  const showLanding = isClosed
  const showShell = !isClosed
  const showSpread = isReading
  const coverFlipped = isReading || (isClosing && !closingFlip)
  const coverAnimating = isClosing || (isReading && !coverParked)

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
    if (isClosed) {
      setCoverParked(false)
      setClosingFlip(false)
    }
  }, [isClosed])

  useEffect(() => {
    if (!isClosing) {
      setClosingFlip(false)
      return
    }
    setCoverParked(false)
    setClosingFlip(false)
    const t = window.setTimeout(() => setClosingFlip(true), COVER_CLOSE_DELAY_MS)
    return () => window.clearTimeout(t)
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
      if (isClosing || isTransitioning) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') bookActor.send({ type: 'NEXT' })
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') bookActor.send({ type: 'PREV' })
      if (e.key === 'Escape') bookActor.send({ type: 'REQUEST_CLOSE' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [bookActor, isClosed, isClosing, isTransitioning])

  const handleCoverAnimDone = () => {
    if (isClosing) {
      if (closingFlip) bookActor.send({ type: 'COVER_ANIMATION_DONE' })
      return
    }
    if (isReading) setCoverParked(true)
  }

  const coverEase = isClosing ? COVER_CLOSE_EASE : COVER_EASE
  const coverDuration = isClosing ? COVER_CLOSE_S : COVER_S

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
            <ThemeToggleIcon theme={theme} />
          </button>
        </div>
      ) : (
        <AnimatePresence>
          {showShell && (
            <motion.header
              className="book-app-header"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: isClosing ? 0.22 : 0.35,
                ease: EASE,
                delay: isClosing ? 0 : 0.45,
              }}
            >
              <div className="book-app-header-left">
                <span className="book-app-brand">{profile.name}</span>
                {isReading && <span className="book-app-chapter">{currentChapter}</span>}
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
                  <ThemeToggleIcon theme={theme} />
                </button>
              </div>
            </motion.header>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {showShell && (
          <motion.div
            className="book-progress-bar"
            aria-hidden
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: isReading ? 1 : 0, scaleX: isReading ? 1 : 0.6 }}
            exit={{ opacity: 0, scaleX: 0.6 }}
            transition={{ duration: 0.28, ease: EASE, delay: isClosing ? 0 : 0.5 }}
          >
            <motion.div
              className="book-progress-bar-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="book-viewport" id="main-content">
        <div className={`book-stage ${isExpanded ? 'book-stage--open' : ''}`}>
          <motion.div
            className={[
              'book',
              isExpanded ? 'book--expanded' : '',
              isClosing ? 'book--closing' : '',
              isOpen && !isClosing ? 'book--opened' : '',
              coverAnimating ? 'book--cover-animating' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            initial={false}
            animate={{
              scale: 1,
              y: isClosing && closingFlip ? 4 : 0,
            }}
            transition={{
              duration: isClosing ? COVER_CLOSE_S : COVER_S,
              ease: coverEase,
              delay: isClosing && closingFlip ? 0 : 0,
            }}
          >
            <motion.div
              className="book-shadow"
              aria-hidden
              animate={{
                opacity: isReading ? 1 : 0,
                scale: isReading ? 1.02 : 1,
              }}
              transition={{ duration: 0.35, ease: EASE }}
            />
            {!showLanding && <div className="book-back" aria-hidden />}

            <motion.div
              className={`book-spread ${showSpread ? 'book-spread--show' : ''}`}
              initial={false}
              animate={{
                opacity: showSpread ? 1 : 0,
                scale: showSpread ? 1 : 0.96,
                filter: showSpread ? 'blur(0px)' : 'blur(6px)',
              }}
              transition={{
                opacity: {
                  duration: isClosing ? 0.28 : 0.42,
                  delay: isClosing ? 0 : 0.38,
                  ease: EASE,
                },
                scale: {
                  duration: isClosing ? 0.32 : 0.48,
                  delay: isClosing ? 0 : 0.34,
                  ease: EASE,
                },
                filter: {
                  duration: isClosing ? 0.24 : 0.35,
                  ease: EASE,
                },
              }}
              style={{ pointerEvents: showSpread ? 'auto' : 'none' }}
            >
              <BookSpread
                page={page}
                bookPages={bookPages}
                isFlipping={isFlipping}
                flipDir={flipDir}
                isCrossfading={isCrossfading}
                canPrev={canPrev}
                canNext={canNext}
                onPrev={() => bookActor.send({ type: 'PREV' })}
                onNext={() => bookActor.send({ type: 'NEXT' })}
                onFlipDone={() => bookActor.send({ type: 'FLIP_DONE' })}
              />
            </motion.div>

            <motion.button
              type="button"
              className={[
                'book-cover',
                coverParked && !isClosing ? 'book-cover--parked' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() =>
                isReading ? bookActor.send({ type: 'REQUEST_CLOSE' }) : bookActor.send({ type: 'OPEN' })
              }
              initial={false}
              animate={{
                rotateY: coverFlipped ? -180 : 0,
                z: coverAnimating ? 20 : 0,
              }}
              transition={{ duration: coverDuration, ease: coverEase }}
              onAnimationComplete={handleCoverAnimDone}
              aria-label={isReading ? ui.closeAria : ui.openAria}
              aria-hidden={coverParked && !isClosing}
              tabIndex={coverParked && !isClosing ? -1 : 0}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="book-cover-face book-cover-front">
                <BookCoverContent
                  lang={lang}
                  ctaLabel={isClosing ? ui.closing : isReading ? ui.close : ui.openBook}
                  showHint={isClosed && !isClosing}
                />
              </div>
              <div className="book-cover-face book-cover-inside" aria-hidden />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showShell && (
          <motion.footer
            className="book-toolbar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{
              duration: isClosing ? 0.24 : 0.38,
              ease: EASE,
              delay: isClosing ? 0 : 0.48,
            }}
          >
            <button
              type="button"
              className="book-nav-btn"
              onClick={() => bookActor.send({ type: 'PREV' })}
              disabled={!canPrev || isTransitioning || isClosing}
              aria-label={ui.back}
            >
              ←
            </button>

            <div className="book-toolbar-main">
              <div className="book-toolbar-track" aria-hidden>
                <motion.div
                  className="book-toolbar-track-fill"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.45, ease: EASE }}
                />
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
                disabled={isClosing}
              >
                {ui.readAgain}
              </button>
            ) : (
              <button
                type="button"
                className="book-nav-btn"
                onClick={() => bookActor.send({ type: 'NEXT' })}
                disabled={!canNext || isTransitioning || isClosing}
                aria-label={ui.next}
              >
                →
              </button>
            )}

            <button
              type="button"
              className="book-nav-btn book-nav-btn--ghost"
              onClick={() => bookActor.send({ type: 'REQUEST_CLOSE' })}
              disabled={isClosing}
            >
              {ui.close}
            </button>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  )
}

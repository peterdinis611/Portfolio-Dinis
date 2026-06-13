import { motion } from 'framer-motion'
import { FLIP_DURATION_MS, FLIP_EASE } from '../../machines/bookMachine'
import type { BookPageDef } from './pages'
import { BookPageContent } from './BookPageContent'

type BookSpreadProps = {
  page: number
  bookPages: BookPageDef[]
  isFlipping: boolean
  flipDir: 1 | -1
  isCrossfading: boolean
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
  onFlipDone: () => void
}

export function BookSpread({
  page,
  bookPages,
  isFlipping,
  flipDir,
  isCrossfading,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onFlipDone,
}: BookSpreadProps) {
  const leftPage = bookPages[page]
  const rightPage = bookPages[page + 1]
  const flipForward = isFlipping && flipDir === 1
  const flipBackward = isFlipping && flipDir === -1
  const isBusy = isFlipping || isCrossfading

  const flipTransition = isFlipping
    ? { duration: FLIP_DURATION_MS / 1000, ease: FLIP_EASE }
    : { duration: 0 }

  const handleFlipComplete = () => {
    if (isFlipping) onFlipDone()
  }

  return (
    <div
      className={`book-spread-inner${isCrossfading ? ' book-spread-inner--jump' : ''}${isBusy ? ' book-spread-inner--busy' : ''}`}
    >
      <div
        className={`book-page book-page--left ${canPrev ? 'can-click' : ''}${flipBackward ? ' book-page--turning' : ''}`}
        onClick={canPrev && !isBusy ? onPrev : undefined}
      >
        {flipBackward && bookPages[page - 1] && (
          <div className="book-page-under">
            <BookPageContent page={bookPages[page - 1]!} side="left" pageNum={page} />
          </div>
        )}

        <motion.div
          className="book-flipper book-flipper--left"
          animate={{ rotateY: flipBackward ? 180 : 0 }}
          transition={flipTransition}
          onAnimationComplete={flipBackward ? handleFlipComplete : undefined}
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'right center' }}
        >
          <div className="book-flip-front">
            {leftPage && (
              <div className="book-page-motion">
                <BookPageContent page={leftPage} side="left" pageNum={page + 1} />
              </div>
            )}
          </div>
          <div className="book-flip-back">
            <div className="book-sheet book-sheet--blank book-sheet--verso" />
          </div>
        </motion.div>
      </div>

      <div className="book-spine-line" aria-hidden />

      <div
        className={`book-page book-page--right ${canNext ? 'can-click' : ''}${flipForward ? ' book-page--turning' : ''}`}
        onClick={canNext && !isBusy ? onNext : undefined}
      >
        {flipForward && bookPages[page + 2] && (
          <div className="book-page-under">
            <BookPageContent page={bookPages[page + 2]!} side="right" pageNum={page + 3} />
          </div>
        )}

        <motion.div
          className="book-flipper book-flipper--right"
          animate={{ rotateY: flipForward ? -180 : 0 }}
          transition={flipTransition}
          onAnimationComplete={flipForward ? handleFlipComplete : undefined}
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
        >
          <div className="book-flip-front">
            {rightPage && (
              <div className="book-page-motion">
                <BookPageContent page={rightPage} side="right" pageNum={page + 2} />
              </div>
            )}
          </div>
          <div className="book-flip-back">
            <div className="book-sheet book-sheet--blank book-sheet--verso" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

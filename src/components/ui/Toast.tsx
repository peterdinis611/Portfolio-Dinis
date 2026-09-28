import { AnimatePresence, motion } from 'framer-motion'
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMotionDisabled } from '@/hooks/useMotionDisabled'
import { cn } from '@/lib/utils'

export type ToastPayload = {
  id?: string
  icon?: string
  title: string
  description?: string
  durationMs?: number
}

type ToastItem = Required<Pick<ToastPayload, 'id' | 'title'>> &
  Omit<ToastPayload, 'id' | 'title'> & { durationMs: number }

type ToastContextValue = {
  toast: (payload: ToastPayload) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let toastSeq = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const motionOff = useMotionDisabled()

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback(
    (payload: ToastPayload) => {
      const id = payload.id ?? `toast-${++toastSeq}`
      const durationMs = payload.durationMs ?? 3800
      setItems((prev) => [
        ...prev.filter((item) => item.id !== id),
        {
          id,
          icon: payload.icon,
          title: payload.title,
          description: payload.description,
          durationMs,
        },
      ])
      window.setTimeout(() => dismiss(id), durationMs)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div
              className="pointer-events-none fixed inset-x-0 bottom-5 z-[2147483001] flex flex-col items-center gap-2 px-4 print:hidden"
              aria-live="polite"
            >
              <AnimatePresence mode="sync">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    role="status"
                    initial={motionOff ? false : { opacity: 0, y: 14, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={motionOff ? undefined : { opacity: 0, y: 8, scale: 0.97 }}
                    transition={
                      motionOff
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 420, damping: 28, mass: 0.7 }
                    }
                    className={cn(
                      'pointer-events-auto w-full max-w-sm rounded-[8px] border border-[rgba(55,53,47,0.12)]',
                      'bg-[color-mix(in_srgb,var(--editor-surface)_94%,var(--primary))] px-3.5 py-3 shadow-[0_12px_40px_-18px_rgba(15,40,42,0.55)]',
                      'dark:border-[rgba(255,255,255,0.12)]',
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-[18px] leading-none" aria-hidden>
                        {item.icon ?? '✨'}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold tracking-[-0.01em] text-foreground">
                          {item.title}
                        </p>
                        {item.description ? (
                          <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => dismiss(item.id)}
                        className="ml-auto shrink-0 rounded-[4px] px-1.5 py-0.5 text-[12px] text-muted-foreground transition-colors hover:bg-[rgba(55,53,47,0.08)] hover:text-foreground dark:hover:bg-[rgba(255,255,255,0.08)]"
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}

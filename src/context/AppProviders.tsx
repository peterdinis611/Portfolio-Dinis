'use client'

import { createActorContext } from '@xstate/react'
import { type ReactNode, useEffect, useState } from 'react'
import { PortfolioCursor } from '@/components/PortfolioCursor'
import { ToastProvider } from '@/components/ui/Toast'
import { settingsMachine } from '@/machines/settingsMachine'

export const SettingsContext = createActorContext(settingsMachine)

function SettingsHydrator({ children }: { children: ReactNode }) {
  const actor = SettingsContext.useActorRef()

  useEffect(() => {
    actor.send({ type: 'HYDRATE' })
  }, [actor])

  return children
}

/** Custom cursor is non-critical — mount after idle / fine pointer only. */
function DeferredPortfolioCursor() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const enable = () => setReady(true)
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(enable, { timeout: 2000 })
      return () => window.cancelIdleCallback(id)
    }
    const timer = setTimeout(enable, 1)
    return () => clearTimeout(timer)
  }, [])

  if (!ready) return null
  return <PortfolioCursor />
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsContext.Provider>
      <SettingsHydrator>
        <ToastProvider>
          <DeferredPortfolioCursor />
          {children}
        </ToastProvider>
      </SettingsHydrator>
    </SettingsContext.Provider>
  )
}

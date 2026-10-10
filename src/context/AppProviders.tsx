'use client'

import { createActorContext } from '@xstate/react'
import { type ReactNode, useEffect } from 'react'
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

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsContext.Provider>
      <SettingsHydrator>
        <ToastProvider>
          <PortfolioCursor />
          {children}
        </ToastProvider>
      </SettingsHydrator>
    </SettingsContext.Provider>
  )
}

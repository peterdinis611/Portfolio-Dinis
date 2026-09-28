import { createActorContext } from '@xstate/react'
import type { ReactNode } from 'react'
import { PortfolioCursor } from '@/components/PortfolioCursor'
import { SeoManager } from '@/components/SeoManager'
import { ToastProvider } from '@/components/ui/Toast'
import { settingsMachine } from '@/machines/settingsMachine'

export const SettingsContext = createActorContext(settingsMachine)

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsContext.Provider>
      <ToastProvider>
        <SeoManager />
        <PortfolioCursor />
        {children}
      </ToastProvider>
    </SettingsContext.Provider>
  )
}

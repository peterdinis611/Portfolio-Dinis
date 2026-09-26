import { createActorContext } from '@xstate/react'
import type { ReactNode } from 'react'
import { PortfolioCursor } from '@/components/PortfolioCursor'
import { SeoManager } from '@/components/SeoManager'
import { settingsMachine } from '@/machines/settingsMachine'

export const SettingsContext = createActorContext(settingsMachine)

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsContext.Provider>
      <SeoManager />
      <PortfolioCursor />
      {children}
    </SettingsContext.Provider>
  )
}

import { createActorContext } from '@xstate/react'
import type { ReactNode } from 'react'
import { SeoManager } from '@/components/SeoManager'
import { settingsMachine } from '@/machines/settingsMachine'

export const SettingsContext = createActorContext(settingsMachine)

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsContext.Provider>
      <SeoManager />
      {children}
    </SettingsContext.Provider>
  )
}

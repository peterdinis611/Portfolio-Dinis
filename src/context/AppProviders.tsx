import { createActorContext } from '@xstate/react'
import type { ReactNode } from 'react'
import { bookMachine } from '../machines/bookMachine'
import { settingsMachine } from '../machines/settingsMachine'

export const BookContext = createActorContext(bookMachine)
export const SettingsContext = createActorContext(settingsMachine)

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SettingsContext.Provider>
      <BookContext.Provider>{children}</BookContext.Provider>
    </SettingsContext.Provider>
  )
}

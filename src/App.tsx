import { AppRoot } from './AppRoot'
import { AppProviders } from './context/AppProviders'
import './index.css'
import './styles/preload.css'

export default function App() {
  return (
    <AppProviders>
      <AppRoot />
    </AppProviders>
  )
}

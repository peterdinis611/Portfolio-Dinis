import { AppRoot } from './AppRoot'
import { AppProviders } from './context/AppProviders'
import './styles/book.css'
import './styles/preload.css'

export default function App() {
  return (
    <AppProviders>
      <AppRoot />
    </AppProviders>
  )
}

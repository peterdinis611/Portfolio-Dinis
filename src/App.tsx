import { AppProviders } from './context/AppProviders'
import { AppRoot } from './AppRoot'
import './styles/book.css'
import './styles/preload.css'

export default function App() {
  return (
    <AppProviders>
      <AppRoot />
    </AppProviders>
  )
}

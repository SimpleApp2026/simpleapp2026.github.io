import { BrowserRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { UserProvider } from './state/UserProvider'
import { AccessibilityProvider } from './state/AccessibilityProvider'
import { TtsProvider } from './state/TtsProvider'
import { AppRoutes } from './routes'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AccessibilityProvider><UserProvider><TtsProvider>{children}</TtsProvider></UserProvider></AccessibilityProvider>
  )
}

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter><AppRoutes /></BrowserRouter>
    </AppProviders>
  )
}

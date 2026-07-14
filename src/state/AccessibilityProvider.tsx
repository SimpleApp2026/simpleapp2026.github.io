import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface A11yApi {
  largeText: boolean; highContrast: boolean
  toggleLargeText: () => void; toggleHighContrast: () => void
}
export const AccessibilityContext = createContext<A11yApi | null>(null)
const KEY = 'simple.a11y'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const initial = load()
  const [largeText, setLargeText] = useState<boolean>(!!initial.largeText)
  const [highContrast, setHighContrast] = useState<boolean>(!!initial.highContrast)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('a11y-large', largeText)
    root.classList.toggle('a11y-contrast', highContrast)
    localStorage.setItem(KEY, JSON.stringify({ largeText, highContrast }))
  }, [largeText, highContrast])

  const value = useMemo<A11yApi>(() => ({
    largeText, highContrast,
    toggleLargeText: () => setLargeText(v => !v),
    toggleHighContrast: () => setHighContrast(v => !v),
  }), [largeText, highContrast])

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

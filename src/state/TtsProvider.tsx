import { createContext, useCallback, useMemo, type ReactNode } from 'react'

export interface TtsApi { speak: (text: string) => void; stop: () => void; supported: boolean }
export const TtsContext = createContext<TtsApi | null>(null)

export function TtsProvider({ children }: { children: ReactNode }) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const speak = useCallback((text: string) => {
    if (!supported) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'es-AR'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }, [supported])
  const stop = useCallback(() => { if (supported) window.speechSynthesis.cancel() }, [supported])
  const value = useMemo<TtsApi>(() => ({ speak, stop, supported }), [speak, stop, supported])
  return <TtsContext.Provider value={value}>{children}</TtsContext.Provider>
}

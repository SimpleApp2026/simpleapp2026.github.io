import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Profile } from '../types'

export interface UserApi {
  profile: Profile | null
  identified: boolean
  setProfile: (p: Profile) => void
  updateProfile: (patch: Partial<Profile>) => void
  setIdentified: (v: boolean) => void
  reset: () => void
}
export const UserContext = createContext<UserApi | null>(null)
const KEY = 'simple.user'

function load(): { profile: Profile | null; identified: boolean } {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '{}'); return { profile: v.profile ?? null, identified: !!v.identified } }
  catch { return { profile: null, identified: false } }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const initial = load()
  const [profile, setProfileState] = useState<Profile | null>(initial.profile)
  const [identified, setIdentified] = useState<boolean>(initial.identified)

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify({ profile, identified })) }, [profile, identified])

  const value = useMemo<UserApi>(() => ({
    profile, identified,
    setProfile: (p) => setProfileState(p),
    updateProfile: (patch) => setProfileState(prev => (prev ? { ...prev, ...patch } : prev)),
    setIdentified,
    reset: () => { setProfileState(null); setIdentified(false) },
  }), [profile, identified])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

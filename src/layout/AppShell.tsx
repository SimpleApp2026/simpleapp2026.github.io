import { Outlet } from 'react-router-dom'
import { PhoneFrame } from './PhoneFrame'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <PhoneFrame>
      <main className="flex-1 overflow-y-auto"><Outlet /></main>
      <BottomNav />
    </PhoneFrame>
  )
}

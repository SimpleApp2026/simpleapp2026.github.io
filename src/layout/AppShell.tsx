import { Outlet } from 'react-router-dom'
import { PhoneFrame } from './PhoneFrame'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <PhoneFrame>
      {/* min-h-0 permite que el área de contenido se achique y scrollee sola,
          en vez de empujar el menú inferior fuera de la pantalla */}
      <main className="flex-1 min-h-0 overflow-y-auto"><Outlet /></main>
      <BottomNav />
    </PhoneFrame>
  )
}

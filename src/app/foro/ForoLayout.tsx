import { NavLink, Outlet } from 'react-router-dom'
import { MicIcon, SpeakerIcon } from '../../ui/icons'
import { useTts } from '../../state/hooks'

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `flex-1 text-center py-3 text-base font-medium border-b-2 ${isActive ? 'border-teal text-navy-900' : 'border-transparent text-ink/50'}`

export function ForoLayout() {
  const { speak } = useTts()
  return (
    <div>
      <header className="bg-navy-900 text-white px-5 py-4 flex items-center gap-3">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Foro</h1>
          <p className="text-sm text-white/70">Comunidad de adultos mayores</p>
        </div>
        <MicIcon className="h-6 w-6 opacity-90" />
        <button aria-label="Leer en voz alta" onClick={() => speak('Foro. Comunidad de adultos mayores.')}>
          <SpeakerIcon className="h-6 w-6" />
        </button>
      </header>
      <nav className="flex bg-surface border-b border-chip/20">
        <NavLink end to="/app/foro" className={tabClass}>Cartas públicas</NavLink>
        <NavLink to="/app/foro/privadas" className={tabClass}>Cartas privadas</NavLink>
        <NavLink to="/app/foro/amigos" className={tabClass}>Amigos</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}

import { NavLink } from 'react-router-dom'
import { HomeIcon, UsersIcon, MapIcon, SettingsIcon } from '../ui/icons'

const items = [
  { to: '/app/home', label: 'Inicio', Icon: HomeIcon },
  { to: '/app/foro', label: 'Comunidad', Icon: UsersIcon },
  { to: '/app/asistente', label: 'Asistente', Icon: UsersIcon, center: true },
  { to: '/app/mapa', label: 'Mapa', Icon: MapIcon },
  { to: '/app/perfil', label: 'Perfil', Icon: SettingsIcon },
]

export function BottomNav() {
  return (
    <nav className="bg-navy-900 text-white flex justify-around items-center py-2">
      {items.map(({ to, label, Icon, center }) => (
        <NavLink key={to} to={to}
          className={({ isActive }) => `flex flex-col items-center text-xs px-2 ${isActive ? 'text-teal' : 'text-white/80'}`}>
          <span className={center ? 'grid place-items-center h-11 w-11 -mt-4 rounded-full bg-teal text-navy-900' : ''}>
            <Icon className="h-6 w-6" />
          </span>
          <span className="sr-only">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

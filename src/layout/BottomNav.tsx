import { NavLink } from 'react-router-dom'
import { HomeIcon, UsersIcon, MapIcon, SettingsIcon } from '../ui/icons'
import ariel from '../assets/img/ariel.png'

const items = [
  { to: '/app/home', label: 'Inicio', Icon: HomeIcon },
  { to: '/app/foro', label: 'Comunidad', Icon: UsersIcon },
  { to: '/app/asistente', label: 'Asistente', Icon: null, center: true },
  { to: '/app/mapa', label: 'Mapa', Icon: MapIcon },
  { to: '/app/perfil', label: 'Perfil', Icon: SettingsIcon },
]

export function BottomNav() {
  return (
    <nav className="bg-navy-900 text-white flex justify-around items-center py-2">
      {items.map(({ to, label, Icon, center }) => (
        <NavLink key={to} to={to}
          className={({ isActive }) => `flex flex-col items-center text-xs px-2 ${isActive ? 'text-teal' : 'text-white/80'}`}>
          {center ? (
            <span className="grid place-items-center h-12 w-12 -mt-5 rounded-full bg-teal overflow-hidden">
              {/* Personaje ARIEL del Figma (ICONO CHAT IA) */}
              <img src={ariel} alt="" className="h-10 w-10 object-contain translate-y-1" />
            </span>
          ) : (
            Icon && <Icon className="h-6 w-6" />
          )}
          <span className="sr-only">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

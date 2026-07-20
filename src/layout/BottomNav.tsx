import { NavLink } from 'react-router-dom'
import { HomeIcon, UsersIcon, MapIcon } from '../ui/icons'
import { useUser } from '../state/hooks'
import { avatarDe } from '../data/avatars'
import ariel from '../assets/img/ariel.png'

export function BottomNav() {
  const { profile } = useUser()
  const fotoPerfil = profile?.fotoDataUrl ?? avatarDe(profile?.nombre)
  return (
    <nav className="bg-navy-900 text-white flex justify-around items-center py-2">
      <NavLink to="/app/home"
        className={({ isActive }) => `flex flex-col items-center text-xs px-2 ${isActive ? 'text-teal' : 'text-white/80'}`}>
        <HomeIcon className="h-6 w-6" />
        <span className="sr-only">Inicio</span>
      </NavLink>
      <NavLink to="/app/foro"
        className={({ isActive }) => `flex flex-col items-center text-xs px-2 ${isActive ? 'text-teal' : 'text-white/80'}`}>
        <UsersIcon className="h-6 w-6" />
        <span className="sr-only">Comunidad</span>
      </NavLink>
      <NavLink to="/app/asistente"
        className={({ isActive }) => `flex flex-col items-center text-xs px-2 ${isActive ? 'text-teal' : 'text-white/80'}`}>
        {/* Personaje ARIEL del Figma sobre fondo gris */}
        <span className="grid place-items-center h-12 w-12 -mt-5 rounded-full bg-[#D3D7D8] overflow-hidden">
          <img src={ariel} alt="" className="h-10 w-10 object-contain translate-y-1" />
        </span>
        <span className="sr-only">Asistente</span>
      </NavLink>
      <NavLink to="/app/mapa"
        className={({ isActive }) => `flex flex-col items-center text-xs px-2 ${isActive ? 'text-teal' : 'text-white/80'}`}>
        <MapIcon className="h-6 w-6" />
        <span className="sr-only">Mapa</span>
      </NavLink>
      <NavLink to="/app/perfil"
        className={({ isActive }) => `flex flex-col items-center text-xs px-2 ${isActive ? 'text-teal' : 'text-white/80'}`}>
        {/* Foto de perfil del usuario (como en el Figma), con fallback genérico */}
        {fotoPerfil ? (
          <img src={fotoPerfil} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="grid place-items-center h-7 w-7 rounded-full bg-[#D3D7D8]" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#8A9296]" fill="currentColor">
              <circle cx="12" cy="9" r="4" />
              <path d="M12 14c-4.4 0-7 2.6-7 6h14c0-3.4-2.6-6-7-6z" />
            </svg>
          </span>
        )}
        <span className="sr-only">Perfil</span>
      </NavLink>
    </nav>
  )
}

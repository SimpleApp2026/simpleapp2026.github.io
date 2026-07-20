import { useNavigate } from 'react-router-dom'
import { useUser } from '../state/hooks'
import { Card } from '../ui/Card'
import { SettingsIcon } from '../ui/icons'
import { AGENDA, AGENDA_FECHA } from '../data/agenda'
import { avatarDe } from '../data/avatars'
import fotoEmpleo from '../assets/img/home-empleo.jpg'
import fotoForo from '../assets/img/home-foro.jpg'
import fotoDescuentos from '../assets/img/home-descuentos.jpg'
import fotoActividades from '../assets/img/home-actividades.jpg'

const CARDS = [
  { to: '/app/empleo', foto: fotoEmpleo, titulo: 'Empleo', sub: 'Mirá las oportunidades laborales' },
  { to: '/app/foro', foto: fotoForo, titulo: 'Foro', sub: 'Clubes y cartas de tu comunidad' },
  { to: '/app/descuentos', foto: fotoDescuentos, titulo: 'Descuentos y sorteos', sub: 'Ofertas exclusivas' },
  { to: '/app/actividades', foto: fotoActividades, titulo: 'Actividades', sub: 'Eventos cerca tuyo' },
]

export function Home() {
  const navigate = useNavigate()
  const { profile } = useUser()
  const foto = profile?.fotoDataUrl ?? avatarDe(profile?.nombre)
  return (
    <div>
      <header className="bg-navy-900 text-white px-5 py-5 flex items-center gap-3">
        {foto ? (
          <img src={foto} alt="" className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-teal/30 grid place-items-center text-xl">👤</div>
        )}
        <div className="flex-1">
          <p className="text-lg font-semibold">Hola{profile?.nombre ? `, ${profile.nombre}` : ''}</p>
          {profile?.barrio && <p className="text-sm text-white/70">{profile.barrio}, Buenos Aires</p>}
        </div>
        <button aria-label="Configuración" onClick={() => navigate('/app/config')}>
          <SettingsIcon className="h-6 w-6" />
        </button>
      </header>

      <div className="p-4 grid grid-cols-2 gap-3">
        {CARDS.map((c) => (
          <button key={c.to} onClick={() => navigate(c.to)} className="text-left">
            <Card className="h-full p-3">
              <img src={c.foto} alt="" className="mb-2 h-20 w-full rounded-xl object-cover" />
              <p className="font-semibold">{c.titulo}</p>
              <p className="text-sm text-ink/60">{c.sub}</p>
            </Card>
          </button>
        ))}
      </div>

      <div className="px-4 pb-6">
        <h2 className="text-lg font-semibold my-3">{AGENDA_FECHA}</h2>
        <div className="flex flex-col gap-3">
          {AGENDA.map((a) => (
            <Card key={a.id}>
              <p className="font-medium">{a.titulo}</p>
              <p className="text-primary text-lg">{a.horario}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { CONVERSACIONES, getCartaPrivada } from '../../data/foro'
import { avatarDe } from '../../data/avatars'
import { MailboxIcon } from '../../ui/icons'

// Frame 56 del Figma: "CONVERSACIONES" con buzón y, por cada amigo, una tarjeta
// blanca con su foto montada sobre una hoja de papel lacrada con un sello navy.
function HojaConFoto({ nombre }: { nombre: string }) {
  const foto = avatarDe(nombre)
  return (
    <span className="relative shrink-0 w-28 h-24 grid place-items-center">
      {/* hoja de papel */}
      <span className="absolute inset-x-2 inset-y-0 rounded-sm bg-cream shadow-inner" aria-hidden="true" />
      {/* lacre */}
      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-navy-900 shadow" aria-hidden="true" />
      {foto
        ? <img src={foto} alt="" className="relative h-14 w-14 rounded-full object-cover -translate-y-1" aria-hidden="true" />
        : <span className="relative h-14 w-14 rounded-full bg-chip/20 grid place-items-center text-2xl -translate-y-1" aria-hidden="true">👤</span>}
      <span className="absolute bottom-1 left-0 right-0 text-center text-sm text-ink/70">{nombre}</span>
    </span>
  )
}

export function Amigos() {
  const navigate = useNavigate()
  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="flex items-center justify-center gap-3 text-xl tracking-wide text-ink/70">
        CONVERSACIONES
        <MailboxIcon className="h-7 w-7 text-navy-900" aria-hidden="true" />
      </h2>
      {CONVERSACIONES.map((c) => (
        <button
          key={c.id}
          className="text-left"
          onClick={() => {
            // Guardamos de qué pestaña venimos para que "atrás" y el envío
            // vuelvan a Amigos y no a Cartas privadas.
            if (getCartaPrivada(c.id)) navigate(`/app/foro/privada/${c.id}`, { state: { origen: '/app/foro/amigos' } })
          }}
        >
          <span className="flex items-center gap-3 rounded-2xl bg-surface shadow-sm p-3">
            <HojaConFoto nombre={c.amigo} />
            <span className="flex-1 min-w-0">
              <span className="block text-lg font-semibold leading-snug">Ponete al día con {c.amigo}</span>
              <span className="block text-ink/60 text-sm line-clamp-2">{c.ultimo}</span>
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}

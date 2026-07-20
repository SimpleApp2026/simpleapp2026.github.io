import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { SpeakerIcon } from '../../ui/icons'
import { getCartaPrivada } from '../../data/foro'
import { avatarDe } from '../../data/avatars'
import { useTts } from '../../state/hooks'
import { PAPEL, SelloPostal } from './paper'

export function CartaPrivada() {
  const navigate = useNavigate()
  const { speak } = useTts()
  const { id } = useParams<{ id: string }>()
  const carta = getCartaPrivada(id ?? '')
  const [menuAbierto, setMenuAbierto] = useState(false)

  if (!carta) {
    return (
      <div>
        <ScreenHeader title="Foro" onBack={() => navigate('/app/foro/privadas')} />
        <p className="p-6 text-lg">Carta no encontrada.</p>
      </div>
    )
  }

  const foto = avatarDe(carta.de)

  return (
    <div className="flex flex-col min-h-full">
      <ScreenHeader title="Foro" onBack={() => navigate('/app/foro/privadas')} />
      {/* Carta abierta sobre papel (frame 52 del Figma) */}
      <div className="relative flex-1 px-5 pt-5 pb-8 flex flex-col" style={PAPEL}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {foto && <img src={foto} alt="" className="h-12 w-12 rounded-full object-cover" aria-hidden="true" />}
            <div>
              <p className="font-semibold text-navy-900 flex items-center gap-2">
                {carta.de}
                <button aria-label="Escuchar carta"
                  onClick={() => speak(`Carta de ${carta.de}. ${carta.texto}`)}
                  className="text-navy-900">
                  <SpeakerIcon className="h-5 w-5" />
                </button>
              </p>
              <p className="text-ink/50 text-sm">{carta.fecha}</p>
            </div>
          </div>
          <SelloPostal />
        </div>

        <p className="mt-5 text-lg leading-relaxed text-ink/85 whitespace-pre-line">{carta.texto}</p>

        {/* Tres puntitos + Responder (frames 52-53 del Figma) */}
        <div className="mt-auto pt-6 flex flex-col items-center gap-1">
          <button
            aria-label="Más opciones"
            aria-haspopup="menu"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(true)}
            className="px-6 py-1 text-2xl tracking-[0.35em] leading-none text-ink/60 hover:text-ink">
            •••
          </button>
          <button
            onClick={() => navigate(`/app/foro/privada/${carta.id}/responder`)}
            className="rounded-full border-2 border-navy-900 bg-transparent text-navy-900
              px-10 py-2 text-lg font-semibold hover:bg-navy-900 hover:text-white transition">
            Responder
          </button>
        </div>

        {/* Menú contextual del usuario (frame 53 del Figma) */}
        {menuAbierto && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuAbierto(false)} aria-hidden="true" />
            <div role="menu" aria-label="Opciones del usuario"
              className="absolute bottom-28 right-4 z-20 w-60 rounded-2xl bg-white shadow-xl border border-chip/20 overflow-hidden">
              <button role="menuitem" onClick={() => setMenuAbierto(false)}
                className="w-full text-center py-3 px-4 text-red-600 font-medium border-b border-chip/15 hover:bg-red-50">
                Reportar usuario
              </button>
              <button role="menuitem" onClick={() => setMenuAbierto(false)}
                className="w-full text-center py-3 px-4 text-ink border-b border-chip/15 hover:bg-bg">
                Ocultar usuario
              </button>
              <button role="menuitem" onClick={() => setMenuAbierto(false)}
                className="w-full text-center py-3 px-4 text-ink hover:bg-bg">
                Ver perfil del usuario
              </button>
              <div className="px-4 pb-3 pt-1">
                <button role="menuitem" onClick={() => setMenuAbierto(false)}
                  className="w-full rounded-full bg-navy-900 text-white py-1.5 text-sm font-semibold hover:bg-navy-800">
                  Cancelar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

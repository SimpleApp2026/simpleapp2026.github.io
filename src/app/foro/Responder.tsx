import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { MicIcon } from '../../ui/icons'
import { getCartaPrivada } from '../../data/foro'
import { avatarDe } from '../../data/avatars'
import { useUser } from '../../state/hooks'
import { PAPEL, SelloPostal, TextoCarta } from './paper'

export function Responder() {
  const navigate = useNavigate()
  const { profile } = useUser()
  const { id } = useParams<{ id: string }>()
  const [texto, setTexto] = useState('')
  const destino = getCartaPrivada(id ?? '')?.de ?? 'tu amigo'
  const fotoPropia = profile?.fotoDataUrl ?? avatarDe(profile?.nombre)

  return (
    <div className="flex flex-col min-h-full">
      <ScreenHeader title="Responder" onBack={() => navigate(`/app/foro/privada/${id}`)} />
      {/* Respuesta sobre papel (frame 54 del Figma) */}
      <div className="flex-1 px-5 pt-5 pb-8 flex flex-col" style={PAPEL}>
        <div className="flex items-start justify-between">
          {fotoPropia
            ? <img src={fotoPropia} alt="" className="h-12 w-12 rounded-full object-cover" aria-hidden="true" />
            : <span className="h-12 w-12 rounded-full bg-chip/20 grid place-items-center text-xl" aria-hidden="true">👤</span>}
          <SelloPostal />
        </div>

        <h1 className="font-display text-3xl font-bold text-ink mt-4 mb-1">Escribí tu carta</h1>
        <TextoCarta
          label="Escribí tu carta"
          value={texto}
          onChange={setTexto}
          placeholder="Escribí acá"
          autoFocus
          minRows={6}
        />
        <p className="flex items-center gap-2 text-ink/50 text-sm mt-1">
          <MicIcon className="h-5 w-5" />
          Escribí tu carta vía mensaje de voz
        </p>

        <div className="mt-auto pt-8 flex justify-center">
          <button
            onClick={() => navigate('/app/foro/enviada', { state: { destino } })}
            className="rounded-full border-2 border-navy-900 bg-transparent text-navy-900
              px-10 py-2 text-lg font-semibold hover:bg-navy-900 hover:text-white transition">
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}

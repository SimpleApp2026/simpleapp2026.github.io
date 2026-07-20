import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { MicIcon } from '../../ui/icons'
import { getClub, agregarPostClub } from '../../data/clubes'
import { avatarDe } from '../../data/avatars'
import { useUser } from '../../state/hooks'
import { TextoCarta } from '../foro/paper'

// Pantalla "Comentá en tu club" (frames 61-63 del Figma): tarjeta blanca
// estilo carta con avatar propio, título, textarea invisible y pill Enviar.
export function ComentarClub() {
  const navigate = useNavigate()
  const { profile } = useUser()
  const { id } = useParams<{ id: string }>()
  const club = getClub(id ?? '')
  const [texto, setTexto] = useState('')

  if (!club) {
    return (
      <div>
        <ScreenHeader title="Clubes" onBack={() => navigate('/app/clubes')} />
        <p className="p-6 text-lg">Club no encontrado.</p>
      </div>
    )
  }

  const nombre = profile?.nombre || 'Vos'
  const foto = profile?.fotoDataUrl ?? avatarDe(nombre)
  const volver = () => navigate(`/app/clubes/${club.id}`)

  const enviar = () => {
    if (!texto.trim()) return
    // Guarda la foto del usuario logueado junto con el post (fotoDataUrl
    // subida en el registro, o su foto del set del Figma si aplica)
    agregarPostClub(club.id, nombre, texto.trim(), foto)
    navigate(`/app/clubes/${club.id}/comentario-enviado`)
  }

  return (
    <div className="flex flex-col min-h-full">
      <ScreenHeader title="Comentá en tu club" onBack={volver} />
      <div className="flex-1 bg-[#EFEFEF] px-5 py-5 flex flex-col gap-5">
        {/* Tarjeta blanca estilo carta */}
        <div className="flex-1 rounded-2xl bg-white shadow-sm border border-chip/15 p-5 flex flex-col">
          <div>
            <p className="text-[11px] text-ink/45 leading-none mb-1">{nombre}</p>
            {foto
              ? <img src={foto} alt="" className="h-10 w-10 rounded-full object-cover" aria-hidden="true" />
              : <span className="h-10 w-10 rounded-full bg-chip/20 grid place-items-center" aria-hidden="true">👤</span>}
          </div>
          <h1 className="font-display text-xl font-bold text-ink mt-5 mb-1">Escribí tu comentario</h1>
          <TextoCarta
            label="Escribí tu comentario"
            value={texto}
            onChange={setTexto}
            placeholder="Escribí acá"
            autoFocus
            minRows={4}
          />
          <p className="flex items-center gap-2 text-ink/50 text-sm mt-2">
            <MicIcon className="h-5 w-5" />
            Escribí tu comentario vía mensaje de voz
          </p>
        </div>
        <button
          onClick={enviar}
          className="self-center rounded-full bg-navy-900 text-white px-14 py-2 text-base font-semibold
            hover:bg-navy-800 transition">
          Enviar
        </button>
      </div>
    </div>
  )
}

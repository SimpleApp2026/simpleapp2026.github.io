import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { SpeakerIcon } from '../../ui/icons'
import { getCartaPublica, type Comentario } from '../../data/foro'
import { avatarDe } from '../../data/avatars'
import { useTts } from '../../state/hooks'
import { PAPEL, SelloPostal } from './paper'

export function CartaPublica() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const carta = getCartaPublica(id ?? '')

  if (!carta) {
    return (
      <div>
        <ScreenHeader title="Foro" onBack={() => navigate('/app/foro')} />
        <p className="p-6 text-lg">Carta no encontrada.</p>
      </div>
    )
  }

  // key por id: navegar de una carta a otra remonta el componente y
  // resiembra los comentarios de la carta nueva (misma ruta :id).
  return <CartaPublicaAbierta key={carta.id} carta={carta} />
}

function CartaPublicaAbierta({ carta }: { carta: NonNullable<ReturnType<typeof getCartaPublica>> }) {
  const navigate = useNavigate()
  const { speak } = useTts()
  const [comentarios, setComentarios] = useState<Comentario[]>(carta.comentarios)
  const [texto, setTexto] = useState('')

  const comentar = () => {
    if (!texto.trim()) return
    setComentarios((prev) => [...prev, { id: `nuevo-${prev.length}`, autor: 'Vos', texto: texto.trim() }])
    setTexto('')
  }

  const foto = avatarDe(carta.autor)

  return (
    <div className="flex flex-col min-h-full">
      <ScreenHeader title="Foro" onBack={() => navigate('/app/foro')} />
      {/* Carta abierta sobre papel (frame 46 del Figma) */}
      <div className="flex-1 px-5 pt-5 pb-6" style={PAPEL}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {foto && <img src={foto} alt="" className="h-12 w-12 rounded-full object-cover" aria-hidden="true" />}
            <div>
              <p className="font-semibold text-navy-900 flex items-center gap-2">
                {carta.autor}
                <button aria-label="Escuchar carta"
                  onClick={() => speak(`Carta de ${carta.autor}. ${carta.texto}`)}
                  className="text-navy-900">
                  <SpeakerIcon className="h-5 w-5" />
                </button>
              </p>
              <p className="text-ink/50 text-sm">{carta.fecha}</p>
            </div>
          </div>
          <SelloPostal />
        </div>

        <p className="mt-4 text-lg leading-relaxed text-ink/85 whitespace-pre-line">{carta.texto}</p>

        {/* Panel de comentarios (blanco sobre el papel, como el Figma) */}
        <div className="mt-6 rounded-2xl bg-white/90 shadow-sm border border-chip/20 p-4">
          <h2 className="text-sm font-bold tracking-wide text-ink/60 uppercase mb-3">
            {comentarios.length} comentarios
          </h2>
          <div className="flex flex-col divide-y divide-chip/15">
            {comentarios.map((c) => {
              const fotoC = avatarDe(c.autor)
              return (
                <div key={c.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  {fotoC
                    ? <img src={fotoC} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" aria-hidden="true" />
                    : <span className="h-9 w-9 rounded-full bg-chip/20 grid place-items-center shrink-0" aria-hidden="true">👤</span>}
                  <span className="flex flex-col">
                    <span className="font-semibold">{c.autor}</span>
                    <span className="text-ink/80">{c.texto}</span>
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-3">
            <TextField label="Escribí un comentario" value={texto} onChange={setTexto} placeholder="Comentá acá..." />
            <Button onClick={comentar}>Comentar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

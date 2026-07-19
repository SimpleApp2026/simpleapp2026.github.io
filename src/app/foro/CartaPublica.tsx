import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { Postcard } from './Postcard'
import { getCartaPublica, type Comentario } from '../../data/foro'
import { avatarDe } from '../../data/avatars'

export function CartaPublica() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const carta = getCartaPublica(id ?? '')
  const [comentarios, setComentarios] = useState<Comentario[]>(carta ? carta.comentarios : [])
  const [texto, setTexto] = useState('')

  if (!carta) {
    return (
      <div>
        <ScreenHeader title="Foro" onBack={() => navigate('/app/foro')} />
        <p className="p-6 text-lg">Carta no encontrada.</p>
      </div>
    )
  }

  const comentar = () => {
    if (!texto.trim()) return
    setComentarios((prev) => [...prev, { id: `nuevo-${prev.length}`, autor: 'Vos', texto: texto.trim() }])
    setTexto('')
  }

  return (
    <div>
      <ScreenHeader title="Foro" onBack={() => navigate('/app/foro')} />
      <div className="p-4 flex flex-col gap-4">
        <Postcard autor={carta.autor} fecha={carta.fecha}>{carta.texto}</Postcard>
        <h2 className="text-lg font-semibold">{comentarios.length} comentarios</h2>
        <div className="flex flex-col gap-2">
          {comentarios.map((c) => {
            const foto = avatarDe(c.autor)
            return (
              <Card key={c.id} className="flex items-start gap-3">
                {foto
                  ? <img src={foto} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" aria-hidden="true" />
                  : <span className="h-9 w-9 rounded-full bg-chip/20 grid place-items-center shrink-0" aria-hidden="true">👤</span>}
                <span className="flex flex-col">
                  <span className="font-semibold">{c.autor}</span>
                  <span className="text-ink/80">{c.texto}</span>
                </span>
              </Card>
            )
          })}
        </div>
        <TextField label="Escribí un comentario" value={texto} onChange={setTexto} placeholder="Comentá acá..." />
        <Button onClick={comentar}>Comentar</Button>
      </div>
    </div>
  )
}

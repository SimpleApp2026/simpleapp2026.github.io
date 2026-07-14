import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'
import { getCartaPrivada } from '../../data/foro'

export function Responder() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [texto, setTexto] = useState('')
  const destino = getCartaPrivada(id ?? '')?.de ?? 'tu amigo'
  return (
    <div>
      <ScreenHeader title="Responder" onBack={() => navigate(`/app/foro/privada/${id}`)} />
      <div className="p-4 flex flex-col gap-4">
        <TextField label="Escribí tu carta" value={texto} onChange={setTexto} placeholder="Escribí acá..." />
        <Button onClick={() => navigate('/app/foro/enviada', { state: { destino } })}>Enviar</Button>
      </div>
    </div>
  )
}

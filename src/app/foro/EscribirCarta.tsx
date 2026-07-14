import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { TextField } from '../../ui/TextField'

export function EscribirCarta() {
  const navigate = useNavigate()
  const [texto, setTexto] = useState('')
  return (
    <div>
      <ScreenHeader title="Escribir carta pública" onBack={() => navigate('/app/foro')} />
      <div className="p-4 flex flex-col gap-4">
        <Card><p className="text-ink/70">Para: Para foro público</p></Card>
        <TextField label="Escribí tu carta" value={texto} onChange={setTexto} placeholder="Escribí acá..." />
        <Button onClick={() => navigate('/app/foro/enviada', { state: { destino: 'el foro público' } })}>Enviar</Button>
      </div>
    </div>
  )
}

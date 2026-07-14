import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Button } from '../../ui/Button'
import { Postcard } from './Postcard'
import { getCartaPrivada } from '../../data/foro'

export function CartaPrivada() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const carta = getCartaPrivada(id ?? '')

  if (!carta) {
    return (
      <div>
        <ScreenHeader title="Foro" onBack={() => navigate('/app/foro/privadas')} />
        <p className="p-6 text-lg">Carta no encontrada.</p>
      </div>
    )
  }

  return (
    <div>
      <ScreenHeader title="Foro" onBack={() => navigate('/app/foro/privadas')} />
      <div className="p-4 flex flex-col gap-4">
        <Postcard autor={carta.de} fecha={carta.fecha}>{carta.texto}</Postcard>
        <Button onClick={() => navigate(`/app/foro/privada/${carta.id}/responder`)}>Responder</Button>
      </div>
    </div>
  )
}

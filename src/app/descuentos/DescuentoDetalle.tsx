import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { getDescuento } from '../../data/descuentos'

export function DescuentoDetalle() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const d = getDescuento(id ?? '')

  if (!d) {
    return (
      <div>
        <ScreenHeader title="Descuentos y sorteos" onBack={() => navigate('/app/descuentos')} />
        <p className="p-6 text-lg">Descuento no encontrado.</p>
      </div>
    )
  }

  return (
    <div>
      <ScreenHeader title="Descuentos y sorteos" onBack={() => navigate('/app/descuentos')} />
      <div className="p-4 flex flex-col gap-4">
        <div className="h-32 rounded-2xl bg-teal/20 grid place-items-center text-5xl" aria-hidden="true">🏷️</div>
        <h1 className="text-2xl font-bold">{d.comercio}</h1>
        <p className="text-primary text-xl font-semibold">{d.oferta}</p>
        <Card><p className="text-ink/80 leading-relaxed">{d.detalle}</p></Card>
        <Button onClick={() => navigate('/app/descuentos/confirmado', { state: { comercio: d.comercio } })}>¡Lo quiero!</Button>
      </div>
    </div>
  )
}

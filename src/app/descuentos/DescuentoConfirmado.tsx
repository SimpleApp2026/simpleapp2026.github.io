import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'

export function DescuentoConfirmado() {
  const navigate = useNavigate()
  const location = useLocation()
  const comercio = (location.state as { comercio?: string } | null)?.comercio
  return (
    <div>
      <ScreenHeader title="Descuentos y sorteos" />
      <div className="p-6 flex flex-col items-center gap-6 text-center">
        <div className="text-6xl" aria-hidden="true">🎉</div>
        <Card className="w-full flex flex-col gap-2">
          <h1 className="text-2xl font-bold">¡Listo!</h1>
          <p className="text-lg">Mostrá este cupón en {comercio ?? 'el comercio'} para usar tu beneficio.</p>
        </Card>
        <Button onClick={() => navigate('/app/descuentos')}>Volver</Button>
      </div>
    </div>
  )
}

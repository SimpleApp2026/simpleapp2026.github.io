import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { ConfirmCard } from '../../ui/ConfirmCard'

export function DescuentoConfirmado() {
  const navigate = useNavigate()
  const location = useLocation()
  const comercio = (location.state as { comercio?: string } | null)?.comercio
  return (
    <div className="flex flex-col min-h-full">
      <ScreenHeader title="Descuentos y sorteos" onBack={() => navigate('/app/descuentos')} />
      <div className="flex-1 px-6 py-14 flex flex-col items-center">
        <ConfirmCard
          titulo="¡Listo!"
          principal="Ya tenés tu beneficio"
          nota={`Mostrá este cupón en ${comercio ?? 'el comercio'} para usarlo.`}
          onAccion={() => navigate('/app/descuentos')}
        />
      </div>
    </div>
  )
}

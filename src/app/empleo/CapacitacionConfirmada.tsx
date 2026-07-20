import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { ConfirmCard } from '../../ui/ConfirmCard'

// Frame 39 del Figma: "Capacitación Final"
export function CapacitacionConfirmada() {
  const navigate = useNavigate()
  const location = useLocation()
  const titulo = (location.state as { titulo?: string } | null)?.titulo

  return (
    <div className="flex flex-col min-h-full">
      <ScreenHeader title="Capacitaciones" onBack={() => navigate('/app/empleo/capacitaciones')} />
      <div className="flex-1 px-6 py-14 flex flex-col items-center">
        <ConfirmCard
          titulo="¡Felicidades!"
          principal="Ya te inscribiste"
          nota={titulo ? `Te esperamos en "${titulo}".` : undefined}
          onAccion={() => navigate('/app/empleo/capacitaciones')}
        />
      </div>
    </div>
  )
}

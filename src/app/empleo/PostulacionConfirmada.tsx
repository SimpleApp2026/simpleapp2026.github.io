import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { ConfirmCard } from '../../ui/ConfirmCard'

// Frame 36 del Figma: "Confirmación"
export function PostulacionConfirmada() {
  const navigate = useNavigate()
  const location = useLocation()
  const puesto = (location.state as { puesto?: string } | null)?.puesto

  return (
    <div className="flex flex-col min-h-full">
      <ScreenHeader title="Oportunidades Laborales" onBack={() => navigate('/app/empleo/oportunidades')} />
      <div className="flex-1 px-6 py-14 flex flex-col items-center">
        <ConfirmCard
          titulo="¡Felicidades!"
          principal="Ya te postulaste"
          nota={puesto ? `Te avisaremos por novedades de ${puesto}.` : undefined}
          onAccion={() => navigate('/app/empleo')}
        />
      </div>
    </div>
  )
}

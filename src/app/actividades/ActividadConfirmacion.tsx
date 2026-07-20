import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { ConfirmCard } from '../../ui/ConfirmCard'

export function ActividadConfirmacion() {
  const navigate = useNavigate()
  const location = useLocation()
  const titulo = (location.state as { titulo?: string } | null)?.titulo

  return (
    <div className="flex flex-col min-h-full">
      <ScreenHeader title="Actividades" onBack={() => navigate('/app/actividades')} />
      {/* Frame 27 del Figma */}
      <div className="flex-1 px-6 py-14 flex flex-col items-center">
        <ConfirmCard
          titulo="¡FELICITACIONES!"
          principal={<>Ya estás inscripto en {titulo ? `"${titulo}"` : 'esta actividad'}</>}
          nota="Ese mismo día te recordaremos la actividad"
          onAccion={() => navigate('/app/actividades')}
        />
      </div>
    </div>
  )
}

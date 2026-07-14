import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'

export function ActividadConfirmacion() {
  const navigate = useNavigate()
  const location = useLocation()
  const titulo = (location.state as { titulo?: string } | null)?.titulo

  return (
    <div>
      <ScreenHeader title="Confirmación de inscripción" />
      <div className="p-6 flex flex-col items-center gap-6 text-center">
        <div className="text-6xl" aria-hidden="true">🎉</div>
        <Card className="w-full flex flex-col gap-2">
          <h1 className="text-2xl font-bold">¡Felicitaciones!</h1>
          <p className="text-lg">Te inscribiste en {titulo ?? 'la actividad'}.</p>
        </Card>
        <Button onClick={() => navigate('/app/actividades')}>Volver a Actividades</Button>
      </div>
    </div>
  )
}

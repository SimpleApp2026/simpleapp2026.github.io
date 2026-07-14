import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'

export function PostulacionConfirmada() {
  const navigate = useNavigate()
  const location = useLocation()
  const puesto = (location.state as { puesto?: string } | null)?.puesto

  return (
    <div>
      <ScreenHeader title="Oportunidades Laborales" />
      <div className="p-6 flex flex-col items-center gap-6 text-center">
        <div className="text-6xl" aria-hidden="true">🎉</div>
        <Card className="w-full flex flex-col gap-2">
          <h1 className="text-2xl font-bold">¡Felicidades!</h1>
          <p className="text-lg">Ya te postulaste{puesto ? ` a ${puesto}` : ''}.</p>
        </Card>
        <Button onClick={() => navigate('/app/empleo')}>Ok</Button>
      </div>
    </div>
  )
}

import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'

// Frame 39 del Figma: "Capacitación Final"
export function CapacitacionConfirmada() {
  const navigate = useNavigate()
  const location = useLocation()
  const titulo = (location.state as { titulo?: string } | null)?.titulo

  return (
    <div>
      <ScreenHeader title="Capacitaciones" />
      <div className="p-6 flex flex-col items-center gap-6 text-center">
        <div className="text-6xl" aria-hidden="true">🎉</div>
        <Card className="w-full flex flex-col gap-2">
          <h1 className="text-2xl font-bold">¡Felicidades!</h1>
          <p className="text-lg">Ya te inscribiste{titulo ? ` a ${titulo}` : ''}.</p>
        </Card>
        <Button onClick={() => navigate('/app/empleo/capacitaciones')}>Ok</Button>
      </div>
    </div>
  )
}

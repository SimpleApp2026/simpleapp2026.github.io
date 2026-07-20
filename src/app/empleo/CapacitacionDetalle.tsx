import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { getCapacitacion } from '../../data/empleo'

// Frame 38 del Figma: "Inscribite Capacitación"
export function CapacitacionDetalle() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const cap = getCapacitacion(id ?? '')

  if (!cap) {
    return (
      <div>
        <ScreenHeader title="Capacitaciones" onBack={() => navigate('/app/empleo/capacitaciones')} />
        <p className="p-6 text-lg">Capacitación no encontrada.</p>
      </div>
    )
  }

  return (
    <div>
      <ScreenHeader title="Capacitaciones" onBack={() => navigate('/app/empleo/capacitaciones')} />
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-navy-900">{cap.titulo}</h1>
        <p className="text-ink/80 leading-relaxed">{cap.descripcion}</p>
        <Card className="flex flex-col gap-1">
          <p className="text-ink/80">📍 {cap.lugar}</p>
          <p className="text-ink/60">{cap.fecha}</p>
        </Card>
        <Button onClick={() => navigate('/app/empleo/capacitaciones/inscripto', { state: { titulo: cap.titulo } })}>
          Inscribite
        </Button>
      </div>
    </div>
  )
}

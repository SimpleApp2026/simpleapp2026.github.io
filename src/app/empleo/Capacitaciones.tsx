import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { CAPACITACIONES } from '../../data/empleo'

export function Capacitaciones() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Capacitaciones" onBack={() => navigate('/app/empleo')} />
      <div className="p-4 flex flex-col gap-3">
        {CAPACITACIONES.map((c) => (
          <Card key={c.id} className="flex flex-col gap-1">
            <p className="font-semibold">{c.titulo}</p>
            <p className="text-ink/70 text-sm">{c.detalle}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

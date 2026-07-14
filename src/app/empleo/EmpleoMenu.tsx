import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'

const OPCIONES = [
  { emoji: '📋', titulo: 'Oportunidades laborales', to: '/app/empleo/oportunidades' },
  { emoji: '📝', titulo: 'Cargá tu experiencia', to: '/app/empleo/experiencia' },
  { emoji: '🎓', titulo: 'Capacitaciones', to: '/app/empleo/capacitaciones' },
]

export function EmpleoMenu() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Empleo" onBack={() => navigate('/app/home')} />
      <div className="p-4 flex flex-col gap-3">
        {OPCIONES.map((o) => (
          <button key={o.to} className="text-left" onClick={() => navigate(o.to)}>
            <Card className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden="true">{o.emoji}</span>
              <span className="text-lg font-semibold">{o.titulo}</span>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}

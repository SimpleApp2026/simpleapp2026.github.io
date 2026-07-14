import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { CATEGORIAS } from '../../data/actividades'

export function ActividadesCategorias() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Actividades" onBack={() => navigate('/app/home')} />
      <div className="p-4 flex flex-col gap-3">
        {CATEGORIAS.map((c) => (
          <button key={c.key} className="text-left" onClick={() => navigate(`/app/actividades/${c.key}`)}>
            <Card className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden="true">{c.emoji}</span>
              <span className="text-lg font-semibold">{c.titulo}</span>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}

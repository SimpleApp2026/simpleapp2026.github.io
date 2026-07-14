import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { CLUBES } from '../../data/clubes'

export function ClubesList() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Clubes" onBack={() => navigate('/app/foro')} />
      <div className="p-4 flex flex-col gap-3">
        {CLUBES.map((c) => (
          <button key={c.id} className="text-left" onClick={() => navigate(`/app/clubes/${c.id}`)}>
            <Card className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden="true">{c.emoji}</span>
              <span className="flex flex-col">
                <span className="text-lg font-semibold">{c.titulo}</span>
                <span className="text-sm text-ink/60">{c.descripcion}</span>
              </span>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}

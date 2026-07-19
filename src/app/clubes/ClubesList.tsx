import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { CLUBES } from '../../data/clubes'
import lectura from '../../assets/img/club-lectura.png'
import chisme from '../../assets/img/club-chisme.png'
import musica from '../../assets/img/club-musica.png'

// Estampillas de clubes del Figma (images-figma/Clubes iconos, hoja 1x3 recortada)
const BADGES: Record<string, string> = { lectura, chisme, musica }

export function ClubesList() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Clubes" onBack={() => navigate('/app/foro')} />
      <div className="p-4 flex flex-col gap-3">
        {CLUBES.map((c) => (
          <button key={c.id} className="text-left" onClick={() => navigate(`/app/clubes/${c.id}`)}>
            <Card className="flex items-center gap-4">
              {BADGES[c.id]
                ? <img src={BADGES[c.id]} alt="" className="h-16 w-16 object-contain" aria-hidden="true" />
                : <span className="text-3xl" aria-hidden="true">{c.emoji}</span>}
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

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
          <Card key={c.id} className="flex flex-col gap-1.5">
            <p className="text-lg font-bold text-navy-900 leading-snug">{c.titulo}</p>
            <p className="text-ink/70 text-sm">{c.detalle}</p>
            {/* Botón azul centrado como el frame 37 del Figma */}
            <button
              onClick={() => navigate(`/app/empleo/capacitaciones/${c.id}`)}
              className="self-center rounded-full bg-navy-900 text-white text-base font-semibold px-7 py-2 hover:bg-navy-800">
              Conocer más
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}

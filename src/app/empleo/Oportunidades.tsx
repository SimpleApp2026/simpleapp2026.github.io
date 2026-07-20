import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { JOBS } from '../../data/empleo'

export function Oportunidades() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Oportunidades Laborales" onBack={() => navigate('/app/empleo')} />
      <div className="p-4 flex flex-col gap-3">
        {JOBS.map((j) => (
          <Card key={j.id} className="flex flex-col gap-1.5">
            {/* Título grande y botón chico, como el frame 34 del Figma */}
            <p className="text-xl font-bold text-navy-900 leading-snug">Puesto: {j.puesto}</p>
            <p className="text-ink/60 text-sm">Rubro: {j.rubro}</p>
            <button
              onClick={() => navigate(`/app/empleo/oportunidades/${j.id}`)}
              className="self-end rounded-full bg-primary text-white text-sm font-medium px-5 py-1.5 hover:bg-primary-dark">
              Conocer más
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}

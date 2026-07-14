import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { JOBS } from '../../data/empleo'

export function Oportunidades() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Oportunidades Laborales" onBack={() => navigate('/app/empleo')} />
      <div className="p-4 flex flex-col gap-3">
        {JOBS.map((j) => (
          <Card key={j.id} className="flex flex-col gap-2">
            <p className="font-semibold">Puesto: {j.puesto}</p>
            <p className="text-ink/70 text-sm">Rubro: {j.rubro}</p>
            <Button onClick={() => navigate(`/app/empleo/oportunidades/${j.id}`)}>Conocer más</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

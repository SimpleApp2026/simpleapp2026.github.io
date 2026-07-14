import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { getJob } from '../../data/empleo'

export function Postular() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const job = getJob(id ?? '')

  if (!job) {
    return (
      <div>
        <ScreenHeader title="Oportunidades Laborales" onBack={() => navigate('/app/empleo/oportunidades')} />
        <p className="p-6 text-lg">Puesto no encontrado.</p>
      </div>
    )
  }

  return (
    <div>
      <ScreenHeader title="Oportunidades Laborales" onBack={() => navigate('/app/empleo/oportunidades')} />
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Puesto: {job.puesto}</h1>
        <Card><p className="text-ink/80 leading-relaxed">{job.descripcion}</p></Card>
        <Button onClick={() => navigate('/app/empleo/postulado', { state: { puesto: job.puesto } })}>Postular</Button>
      </div>
    </div>
  )
}

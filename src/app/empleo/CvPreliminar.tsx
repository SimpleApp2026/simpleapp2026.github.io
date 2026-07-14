import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Chip } from '../../ui/Chip'
import { Button } from '../../ui/Button'
import { useUser } from '../../state/hooks'

const HABILIDADES = ['Paquete Office', 'Responsable', 'Empática', 'Paciente']

export function CvPreliminar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useUser()
  const stateNombre = (location.state as { nombre?: string } | null)?.nombre
  const nombre = (stateNombre && stateNombre.trim())
    || (profile ? `${profile.nombre} ${profile.apellido}`.trim() : '')
    || 'Susana Martinez'

  return (
    <div>
      <ScreenHeader title="CV" onBack={() => navigate('/app/empleo/experiencia')} />
      <div className="p-4 flex flex-col gap-4">
        <Card className="bg-teal/10">
          <h1 className="text-2xl font-bold">{nombre}</h1>
          <p className="text-ink/70">Profesora de Inglés</p>
        </Card>
        <Card>
          <h2 className="font-semibold mb-1">Sobre mi</h2>
          <p className="text-ink/80">Soy profesora de inglés con 30 años de experiencia.</p>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <h2 className="font-semibold mb-1">Educación</h2>
            <p className="text-ink/80 text-sm">Profesorado en Lenguas Vivas</p>
          </Card>
          <Card>
            <h2 className="font-semibold mb-2">Habilidades</h2>
            <div className="flex flex-wrap gap-2">
              {HABILIDADES.map((h) => <Chip key={h}>{h}</Chip>)}
            </div>
          </Card>
        </div>
        <Card>
          <h2 className="font-semibold mb-1">Experiencia</h2>
          <p className="text-ink/80 text-sm">Inmaculada Concepción de María (1992 – 2012)</p>
          <p className="text-ink/80 text-sm">Canadá School (2012 – 2022)</p>
        </Card>
        <Button onClick={() => navigate('/app/empleo')}>Guardar</Button>
      </div>
    </div>
  )
}

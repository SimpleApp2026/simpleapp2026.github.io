import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { StepProgress } from './StepProgress'
import { Button } from '../ui/Button'

export function FotoPreguntar() {
  const navigate = useNavigate()
  return (
    <OnboardingScreen footer="Con cargar tu foto desbloqueás un logro">
      <StepProgress step={1} total={3} />
      <div className="p-6 flex flex-col gap-6 text-center">
        <h2 className="text-2xl font-semibold mt-6">¿Te gustaría poner una foto de perfil?</h2>
        <Button onClick={() => navigate('/registro/foto/cargar')}>Sí</Button>
        <Button variant="secondary" onClick={() => navigate('/app/home')}>No</Button>
      </div>
    </OnboardingScreen>
  )
}

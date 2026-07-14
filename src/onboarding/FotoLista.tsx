import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { StepProgress } from './StepProgress'
import { Button } from '../ui/Button'
import { useUser } from '../state/hooks'

export function FotoLista() {
  const navigate = useNavigate()
  const { profile } = useUser()
  return (
    <OnboardingScreen footer="¡Lo lograste! Felicitaciones">
      <StepProgress step={3} total={3} />
      <div className="p-6 flex flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-semibold mt-6">Tu foto quedó cargada</h2>
        {profile?.fotoDataUrl && (
          <img src={profile.fotoDataUrl} alt="Tu foto de perfil"
            className="h-40 w-40 rounded-full object-cover" />
        )}
        <p className="text-lg">¿Deseás cambiarla?</p>
        <div className="flex gap-4 w-full">
          <Button variant="secondary" onClick={() => navigate('/registro/foto/cargar')}>Sí</Button>
          <Button onClick={() => navigate('/app/home')}>No</Button>
        </div>
      </div>
    </OnboardingScreen>
  )
}

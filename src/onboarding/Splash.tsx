import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { Button } from '../ui/Button'

export function Splash() {
  const navigate = useNavigate()
  return (
    <OnboardingScreen>
      <div className="flex flex-col items-center text-center px-6 py-10 gap-6 min-h-full">
        <p className="text-lg text-ink/70">Bienvenido a</p>
        <h1 className="text-5xl font-bold text-navy-900">+simple</h1>
        <div aria-hidden="true"
          className="my-6 h-48 w-48 rounded-full bg-teal/20 grid place-items-center text-teal">
          <svg viewBox="0 0 24 24" className="h-24 w-24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
          </svg>
        </div>
        <p className="text-base text-ink/60">Ciudad de Buenos Aires</p>
        <div className="mt-auto w-full">
          <Button onClick={() => navigate('/identificacion')}>Comenzar</Button>
        </div>
      </div>
    </OnboardingScreen>
  )
}

import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { Button } from '../ui/Button'
import logo from '../assets/img/logo-simple.png'
import mapa from '../assets/img/mapa-ba.jpg'
import logoBA from '../assets/img/logo-ba.webp'

export function Splash() {
  const navigate = useNavigate()
  return (
    <OnboardingScreen>
      <div className="flex flex-col items-center text-center px-6 py-10 gap-5 min-h-full">
        <p className="text-lg text-ink/70">Bienvenido a</p>
        <img src={logo} alt="+simple" className="h-14 w-auto" />
        <img
          src={mapa}
          alt="Mapa ilustrado de los barrios de Buenos Aires"
          className="my-2 w-full max-w-[320px] rounded-2xl"
        />
        {/* Logo oficial BA Buenos Aires Ciudad (images-figma/logo.webp) */}
        <img src={logoBA} alt="Buenos Aires Ciudad" className="mt-2 h-12 w-auto" />
        <div className="mt-auto w-full">
          <Button onClick={() => navigate('/identificacion')}>Comenzar</Button>
        </div>
      </div>
    </OnboardingScreen>
  )
}

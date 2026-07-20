import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { Button } from '../ui/Button'
import logo from '../assets/img/logo-simple.png'
import mapa from '../assets/img/mapa-ba.jpg'

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
        {/* Logo BA Buenos Aires Ciudad (pie del frame 01 del Figma) */}
        <div className="mt-2 flex items-center gap-2 text-ink" aria-label="Buenos Aires Ciudad">
          <span className="text-3xl font-black tracking-tight leading-none">BA</span>
          <span className="text-left text-xs font-semibold leading-tight">
            Buenos Aires<br />Ciudad
          </span>
        </div>
        <div className="mt-auto w-full">
          <Button onClick={() => navigate('/identificacion')}>Comenzar</Button>
        </div>
      </div>
    </OnboardingScreen>
  )
}

import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../layout/PhoneFrame'
import { Button } from '../ui/Button'
import { useUser } from '../state/hooks'

export function Identificacion() {
  const navigate = useNavigate()
  const { setIdentified } = useUser()
  const identificarme = () => { setIdentified(true); navigate('/registro/datos') }
  const anonimo = () => { setIdentified(false); navigate('/app/home') }
  return (
    <PhoneFrame>
      <div className="flex-1 bg-navy-900 text-white flex flex-col justify-center items-center gap-6 px-8 text-center">
        <div aria-hidden="true" className="h-28 w-28 rounded-full bg-white/10 grid place-items-center mb-4">
          <svg viewBox="0 0 24 24" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </div>
        <Button variant="secondary" className="bg-white/10 hover:bg-white/20"
          onClick={identificarme}>Deseo identificarme</Button>
        <Button variant="secondary" className="bg-white/10 hover:bg-white/20"
          onClick={anonimo}>Sin identificarme</Button>
      </div>
    </PhoneFrame>
  )
}

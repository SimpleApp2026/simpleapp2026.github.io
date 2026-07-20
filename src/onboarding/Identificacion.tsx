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
        {/* Avatar genérico gris (como el frame 02 del Figma) */}
        <div aria-hidden="true" className="h-28 w-28 rounded-full bg-[#D3D7D8] overflow-hidden grid place-items-end mb-4">
          <svg viewBox="0 0 24 24" className="h-24 w-24 text-[#8A9296]" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="9" r="4.5" />
            <path d="M12 15c-5 0-8 3-8 7h16c0-4-3-7-8-7z" />
          </svg>
        </div>
        <Button variant="gray" onClick={identificarme}>Deseo identificarme</Button>
        <Button variant="gray" onClick={anonimo}>Sin identificarme</Button>
      </div>
    </PhoneFrame>
  )
}

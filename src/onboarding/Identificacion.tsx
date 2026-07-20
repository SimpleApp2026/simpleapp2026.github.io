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
        {/* Avatar genérico gris del frame 02 del Figma: ocupa la mitad del ancho
            de la pantalla y la silueta va inscrita en el círculo (el arco de los
            hombros se recorta contra el borde, como en el diseño). */}
        <svg viewBox="0 0 24 24" className="w-52 max-w-[85%] aspect-square mb-4" aria-hidden="true">
          <defs>
            <clipPath id="avatar-recorte">
              <circle cx="12" cy="12" r="12" />
            </clipPath>
          </defs>
          <circle cx="12" cy="12" r="12" fill="#D3D7D8" />
          <g fill="#8A9296" clipPath="url(#avatar-recorte)">
            <circle cx="12" cy="9.6" r="3.5" />
            <path d="M12 14.2c-4.1 0-6.6 2.7-6.6 6.2 0 2.4 2 3.6 6.6 3.6s6.6-1.2 6.6-3.6c0-3.5-2.5-6.2-6.6-6.2z" />
          </g>
        </svg>
        <Button variant="gray" onClick={identificarme}>Deseo identificarme</Button>
        <Button variant="gray" onClick={anonimo}>Sin identificarme</Button>
      </div>
    </PhoneFrame>
  )
}

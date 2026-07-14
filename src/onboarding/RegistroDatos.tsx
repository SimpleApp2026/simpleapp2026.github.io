import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { ScreenHeader } from '../layout/ScreenHeader'
import { TextField } from '../ui/TextField'
import { Button } from '../ui/Button'
import { useUser } from '../state/hooks'

export function RegistroDatos() {
  const navigate = useNavigate()
  const { setProfile } = useUser()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [barrio, setBarrio] = useState('')
  const [fecha, setFecha] = useState('')
  const [acepta, setAcepta] = useState(false)

  const valido = nombre.trim() !== '' && apellido.trim() !== '' && acepta

  const continuar = () => {
    setProfile({ nombre, apellido, barrio, fechaNacimiento: fecha, fotoDataUrl: null, intereses: [] })
    navigate('/registro/intereses')
  }

  return (
    <OnboardingScreen>
      <ScreenHeader title="Completá tus datos" onBack={() => navigate('/identificacion')} />
      <div className="p-6">
        <TextField label="Nombre" value={nombre} onChange={setNombre} placeholder="Nombre" />
        <TextField label="Apellido" value={apellido} onChange={setApellido} placeholder="Apellido" />
        <TextField label="Barrio" value={barrio} onChange={setBarrio} placeholder="ej: San Cristóbal" />
        <TextField label="Fecha de Cumpleaños" type="date" value={fecha} onChange={setFecha} placeholder="ej: 20/07/1956" />
        <label className="flex items-center gap-3 my-4 text-base">
          <input type="checkbox" className="h-5 w-5" checked={acepta}
            onChange={(e) => setAcepta(e.target.checked)} />
          Acepto los términos y condiciones
        </label>
        <Button disabled={!valido} onClick={continuar}>Continuar</Button>
      </div>
    </OnboardingScreen>
  )
}

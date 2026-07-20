import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import arielImg from '../../assets/img/ariel.png'
import { TextField } from '../../ui/TextField'
import { Chip } from '../../ui/Chip'
import { Button } from '../../ui/Button'

type Disp = 'Media jornada' | 'Jornada completa'

export function CvBuilder() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [barrio, setBarrio] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [disp, setDisp] = useState<Disp | null>(null)

  const ver = () => navigate('/app/empleo/cv', { state: { nombre, disponibilidad: disp } })

  return (
    <div>
      <ScreenHeader title="Cargá tu experiencia" onBack={() => navigate('/app/empleo')} />
      <div className="p-4">
        {/* ARIEL con globo de diálogo (frame 32 del Figma) */}
        <div className="flex items-center gap-3 mb-4">
          <img src={arielImg} alt="" className="h-14 w-14 object-contain shrink-0" aria-hidden="true" />
          <p className="rounded-full bg-navy-900 text-white px-5 py-2 text-base font-medium">
            ¡Creemos tu CV!
          </p>
        </div>
        <TextField label="Nombre y apellido" value={nombre} onChange={setNombre} placeholder="Ej: Carlos Gutierrez" />
        <TextField label="Barrio" value={barrio} onChange={setBarrio} placeholder="Ej: Recoleta" />
        <TextField label="Teléfono" value={telefono} onChange={setTelefono} placeholder="Escribí tu número" />
        <TextField label="Email" value={email} onChange={setEmail} placeholder="Escribí tu email" />
        <p className="text-lg font-semibold mb-2">Disponibilidad</p>
        <div className="flex gap-3 mb-6">
          {(['Media jornada', 'Jornada completa'] as Disp[]).map((d) => (
            <Chip key={d} selected={disp === d} onClick={() => setDisp(d)}>{d}</Chip>
          ))}
        </div>
        <Button onClick={ver}>Ver curriculum</Button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../state/hooks'
import { ScreenHeader } from '../layout/ScreenHeader'
import { Card } from '../ui/Card'
import { Chip } from '../ui/Chip'
import { Button } from '../ui/Button'
import { TextField } from '../ui/TextField'
import { ageFromIso, formatLongDate } from '../lib/age'

export function Perfil() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useUser()
  const [editing, setEditing] = useState(false)
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [barrio, setBarrio] = useState('')

  if (!profile) {
    return (
      <div>
        <ScreenHeader title="Perfil" />
        <div className="p-6 flex flex-col items-center gap-4 text-center">
          <p className="text-lg">Completá tu perfil para personalizar +Simple.</p>
          <Button onClick={() => navigate('/registro/datos')}>Completar registro</Button>
        </div>
      </div>
    )
  }

  const startEdit = () => {
    setNombre(profile.nombre); setApellido(profile.apellido); setBarrio(profile.barrio); setEditing(true)
  }
  const guardar = () => { updateProfile({ nombre, apellido, barrio }); setEditing(false) }
  const edad = ageFromIso(profile.fechaNacimiento)

  return (
    <div>
      <ScreenHeader title="Perfil" />
      <div className="p-6 flex flex-col items-center gap-4">
        {profile.fotoDataUrl
          ? <img src={profile.fotoDataUrl} alt="Foto de perfil" className="h-32 w-32 rounded-full object-cover" />
          : <div className="h-32 w-32 rounded-full bg-chip/20 grid place-items-center text-4xl" aria-hidden="true">👤</div>}

        {editing ? (
          <Card className="w-full">
            <TextField label="Nombre" value={nombre} onChange={setNombre} />
            <TextField label="Apellido" value={apellido} onChange={setApellido} />
            <TextField label="Barrio" value={barrio} onChange={setBarrio} />
            <Button onClick={guardar}>Guardar</Button>
          </Card>
        ) : (
          <Card className="w-full text-center flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{profile.nombre} {profile.apellido}</h1>
            {edad !== null && <p className="text-lg">Edad {edad}</p>}
            {profile.fechaNacimiento && <p className="text-ink/70">{formatLongDate(profile.fechaNacimiento)}</p>}
            {profile.barrio && <p className="text-ink/70">Barrio de {profile.barrio}</p>}
            {profile.intereses.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {profile.intereses.map((i) => <Chip key={i}>{i}</Chip>)}
              </div>
            )}
            <Button className="mt-3" onClick={startEdit}>Editar</Button>
          </Card>
        )}
      </div>
    </div>
  )
}

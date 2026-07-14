import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { ScreenHeader } from '../layout/ScreenHeader'
import { Chip } from '../ui/Chip'
import { Button } from '../ui/Button'
import { useUser } from '../state/hooks'
import type { Interest } from '../types'

const OPCIONES: { key: Interest; emoji: string }[] = [
  { key: 'Gastronomía', emoji: '🍽️' },
  { key: 'Idiomas', emoji: '📚' },
  { key: 'Jardinería', emoji: '🌱' },
  { key: 'Manualidades', emoji: '🎨' },
]

export function RegistroIntereses() {
  const navigate = useNavigate()
  const { updateProfile } = useUser()
  const [sel, setSel] = useState<Interest[]>([])

  const toggle = (k: Interest) =>
    setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))

  const continuar = () => { updateProfile({ intereses: sel }); navigate('/registro/foto') }

  return (
    <OnboardingScreen>
      <ScreenHeader title="Intereses" onBack={() => navigate('/registro/datos')} />
      <div className="p-6 flex flex-col gap-4">
        <p className="text-base text-ink/70">¡Queremos conocerte más!</p>
        <h2 className="text-2xl font-semibold">¿Qué temas te interesan?</h2>
        <div className="flex flex-col gap-3 my-4">
          {OPCIONES.map(({ key, emoji }) => (
            <Chip key={key} selected={sel.includes(key)} onClick={() => toggle(key)}>
              {emoji} {key}
            </Chip>
          ))}
        </div>
        <Button onClick={continuar}>Continuar</Button>
      </div>
    </OnboardingScreen>
  )
}

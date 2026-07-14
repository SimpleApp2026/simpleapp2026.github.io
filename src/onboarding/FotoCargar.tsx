import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingScreen } from './OnboardingScreen'
import { StepProgress } from './StepProgress'
import { useUser } from '../state/hooks'

export function FotoCargar() {
  const navigate = useNavigate()
  const { updateProfile } = useUser()
  const inputRef = useRef<HTMLInputElement>(null)

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updateProfile({ fotoDataUrl: String(reader.result) })
      navigate('/registro/foto/lista')
    }
    reader.readAsDataURL(file)
  }

  return (
    <OnboardingScreen footer="Estás muy cerca... ¡Vamos!">
      <StepProgress step={2} total={3} />
      <div className="p-6 flex flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-semibold mt-6">Creemos tu foto</h2>
        <label className="cursor-pointer flex flex-col items-center gap-3">
          <span className="text-lg text-ink/70">Tocá el lápiz para sumar tu foto</span>
          <span aria-hidden="true" className="h-40 w-40 rounded-full bg-chip/20 grid place-items-center text-primary">
            <svg viewBox="0 0 24 24" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </span>
          <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={onFile} />
        </label>
      </div>
    </OnboardingScreen>
  )
}

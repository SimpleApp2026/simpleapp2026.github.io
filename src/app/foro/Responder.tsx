import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'

export function Responder() {
  const navigate = useNavigate()
  return (
    <>
      <ScreenHeader title="Responder" onBack={() => navigate(-1)} />
      <div className="p-6 text-lg text-ink/70">Responder — Próximamente</div>
    </>
  )
}

import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'

export function EscribirCarta() {
  const navigate = useNavigate()
  return (
    <>
      <ScreenHeader title="Escribir carta" onBack={() => navigate(-1)} />
      <div className="p-6 text-lg text-ink/70">Escribir carta — Próximamente</div>
    </>
  )
}

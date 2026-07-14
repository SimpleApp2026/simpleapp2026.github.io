import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'

export function CartaPrivada() {
  const navigate = useNavigate()
  return (
    <>
      <ScreenHeader title="Carta privada" onBack={() => navigate(-1)} />
      <div className="p-6 text-lg text-ink/70">Carta privada — Próximamente</div>
    </>
  )
}

import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'

export function CartaEnviada() {
  const navigate = useNavigate()
  return (
    <>
      <ScreenHeader title="Carta enviada" onBack={() => navigate(-1)} />
      <div className="p-6 text-lg text-ink/70">Carta enviada — Próximamente</div>
    </>
  )
}

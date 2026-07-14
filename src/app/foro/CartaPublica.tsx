import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'

export function CartaPublica() {
  const navigate = useNavigate()
  return (
    <>
      <ScreenHeader title="Carta" onBack={() => navigate(-1)} />
      <div className="p-6 text-lg text-ink/70">Carta pública — Próximamente</div>
    </>
  )
}

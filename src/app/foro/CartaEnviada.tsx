import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { PAPEL } from './paper'

export function CartaEnviada() {
  const navigate = useNavigate()
  const location = useLocation()
  const destino = (location.state as { destino?: string } | null)?.destino
  return (
    <div className="flex flex-col min-h-full">
      <ScreenHeader title="Foro" />
      {/* Confirmación sobre papel con tarjeta navy (frames 45/51/55 del Figma) */}
      <div className="flex-1 px-6 py-10 flex flex-col items-center gap-8" style={PAPEL}>
        <div className="w-full max-w-xs rounded-2xl bg-navy-900 text-white text-center px-6 py-10 shadow-lg flex flex-col gap-3">
          <h1 className="text-2xl font-bold">¡Felicitaciones!</h1>
          <p className="text-lg text-white/90">Tu carta fue enviada a {destino ?? 'destino'}.</p>
          <button
            onClick={() => navigate('/app/foro')}
            className="mt-4 self-center rounded-full border-2 border-white/80 text-white
              px-10 py-1.5 text-base font-semibold hover:bg-white hover:text-navy-900 transition">
            Ok
          </button>
        </div>
      </div>
    </div>
  )
}

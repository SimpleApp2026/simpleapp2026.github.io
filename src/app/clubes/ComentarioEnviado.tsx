import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'

// Confirmación al enviar un comentario al club (frames 64-66 del Figma)
export function ComentarioEnviado() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  return (
    <div className="flex flex-col min-h-full">
      <ScreenHeader title="Comentá en tu club" />
      <div className="flex-1 bg-[#EFEFEF] px-6 py-10 flex flex-col items-center">
        <div className="w-full max-w-xs rounded-2xl bg-navy-900 text-white text-center px-6 py-10 shadow-lg flex flex-col gap-2">
          <h1 className="text-xl font-bold">¡Felicidades!</h1>
          <p className="text-lg font-semibold text-white/95">Enviaste tu comentario al club</p>
          <button
            onClick={() => navigate(`/app/clubes/${id}`)}
            className="mt-4 self-center rounded-full border-2 border-white/80 text-white
              px-12 py-1.5 text-base font-semibold hover:bg-white hover:text-navy-900 transition">
            Ok
          </button>
        </div>
      </div>
    </div>
  )
}

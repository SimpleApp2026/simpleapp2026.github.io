import { useNavigate } from 'react-router-dom'
import { Card } from '../../ui/Card'
import { CONVERSACIONES, getCartaPrivada } from '../../data/foro'

export function Amigos() {
  const navigate = useNavigate()
  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Conversaciones</h2>
      {CONVERSACIONES.map((c) => (
        <button
          key={c.id}
          className="text-left"
          onClick={() => {
            if (getCartaPrivada(c.id)) navigate(`/app/foro/privada/${c.id}`)
          }}
        >
          <Card className="flex items-center gap-3">
            <span className="h-12 w-12 rounded-full bg-chip/20 grid place-items-center text-2xl" aria-hidden="true">👤</span>
            <span className="flex-1">
              <span className="block font-semibold">{c.amigo}</span>
              <span className="block text-ink/60 text-sm line-clamp-1">{c.ultimo}</span>
            </span>
          </Card>
        </button>
      ))}
    </div>
  )
}

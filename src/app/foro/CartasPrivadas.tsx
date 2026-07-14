import { useNavigate } from 'react-router-dom'
import { Postcard } from './Postcard'
import { CARTAS_PRIVADAS } from '../../data/foro'

export function CartasPrivadas() {
  const navigate = useNavigate()
  return (
    <div className="p-4 flex flex-col gap-4">
      {CARTAS_PRIVADAS.map((c) => (
        <button key={c.id} className="text-left" onClick={() => navigate(`/app/foro/privada/${c.id}`)}>
          <Postcard autor={c.de} fecha={c.fecha}>
            <p className="line-clamp-3">{c.texto}</p>
          </Postcard>
        </button>
      ))}
    </div>
  )
}

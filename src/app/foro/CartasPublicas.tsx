import { useNavigate } from 'react-router-dom'
import { Button } from '../../ui/Button'
import { Postcard } from './Postcard'
import { CARTAS_PUBLICAS } from '../../data/foro'

export function CartasPublicas() {
  const navigate = useNavigate()
  return (
    <div className="p-4 flex flex-col gap-4">
      <Button onClick={() => navigate('/app/foro/escribir')}>Escribir carta</Button>
      <Button variant="ghost" onClick={() => navigate('/app/clubes')}>Clubes de la comunidad</Button>
      {CARTAS_PUBLICAS.map((c) => (
        <button key={c.id} className="text-left" onClick={() => navigate(`/app/foro/carta/${c.id}`)}>
          <Postcard autor={c.autor} fecha={c.fecha}>
            <p className="line-clamp-3">{c.texto}</p>
          </Postcard>
        </button>
      ))}
    </div>
  )
}

import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { getActividad, getCategoria } from '../../data/actividades'
import { BADGES } from './badges'

export function ActividadDetalle() {
  const navigate = useNavigate()
  const { cat, id } = useParams<{ cat: string; id: string }>()
  const actividad = getActividad(id ?? '')
  const categoria = getCategoria(cat ?? '')

  if (!actividad) {
    return (
      <div>
        <ScreenHeader title="Actividad" onBack={() => navigate('/app/actividades')} />
        <p className="p-6 text-lg">Actividad no encontrada.</p>
      </div>
    )
  }

  const reservar = () =>
    navigate('/app/actividades/confirmada', { state: { titulo: actividad.titulo } })

  return (
    <div>
      <ScreenHeader title={categoria?.titulo ?? 'Actividad'} onBack={() => navigate(`/app/actividades/${cat}`)} />
      <div className="p-4 flex flex-col gap-4">
        <div className="h-40 rounded-2xl bg-teal/20 grid place-items-center" aria-hidden="true">
          {categoria
            ? <img src={BADGES[categoria.key]} alt="" className="h-32 w-32 object-contain" />
            : <span className="text-5xl">📅</span>}
        </div>
        <h1 className="text-2xl font-bold">{actividad.titulo}</h1>
        {actividad.descripcion && <p className="text-ink/70">{actividad.descripcion}</p>}
        <Card className="flex flex-col gap-1">
          <p className="text-ink/80">📍 {actividad.lugar}</p>
          <p className="text-ink/60">{actividad.fecha}</p>
        </Card>
        <Button onClick={reservar}>{actividad.categoria === 'salud' ? '¡Quiero ir!' : 'Reservar'}</Button>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { DESCUENTOS } from '../../data/descuentos'

export function DescuentosList() {
  const navigate = useNavigate()
  return (
    <div>
      <ScreenHeader title="Descuentos y sorteos" onBack={() => navigate('/app/home')} />
      <div className="p-4 flex flex-col gap-3">
        {DESCUENTOS.map((d) => (
          <button key={d.id} className="text-left" onClick={() => navigate(`/app/descuentos/${d.id}`)}>
            <Card className="flex flex-col gap-1">
              <span className="text-lg font-semibold">{d.comercio}</span>
              <span className="text-primary">{d.oferta}</span>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}

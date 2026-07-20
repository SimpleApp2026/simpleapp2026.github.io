import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { getCategoria, actividadesDeCategoria, type CategoriaKey, type Actividad } from '../../data/actividades'

export function ActividadCategoria() {
  const navigate = useNavigate()
  const { cat } = useParams<{ cat: string }>()
  const categoria = getCategoria(cat ?? '')

  if (!categoria) {
    return (
      <div>
        <ScreenHeader title="Actividades" onBack={() => navigate('/app/actividades')} />
        <p className="p-6 text-lg">Categoría no encontrada.</p>
      </div>
    )
  }

  const actividades = actividadesDeCategoria(categoria.key as CategoriaKey)
  const grupos = actividades.reduce<Record<string, Actividad[]>>((acc, a) => {
    (acc[a.grupo] ||= []).push(a); return acc
  }, {})

  return (
    <div>
      <ScreenHeader title={categoria.titulo} onBack={() => navigate('/app/actividades')} />
      <div className="p-4 flex flex-col gap-5">
        {Object.entries(grupos).map(([grupo, items]) => (
          <section key={grupo} className="flex flex-col gap-3">
            {/* Label del grupo más grande que los títulos de las cards (como en el Figma) */}
            <span className="self-start rounded-full bg-teal/30 text-navy-900 px-4 py-1.5 text-xl font-bold">{grupo}</span>
            {items.map((a) => (
              <button key={a.id} className="text-left" onClick={() => navigate(`/app/actividades/${categoria.key}/${a.id}`)}>
                <Card className="flex flex-col gap-1">
                  <p className="font-semibold">{a.titulo}</p>
                  <p className="text-ink/70">📍 {a.lugar}</p>
                  <p className="text-ink/60 text-sm">{a.fecha}</p>
                </Card>
              </button>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

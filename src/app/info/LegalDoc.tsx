import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { getDoc } from '../../data/legal'

export function LegalDoc() {
  const navigate = useNavigate()
  const { doc } = useParams<{ doc: string }>()
  const data = getDoc(doc ?? '')

  if (!data) {
    return (
      <div>
        <ScreenHeader title="Información" onBack={() => navigate('/app/config')} />
        <p className="p-6 text-lg">Documento no encontrado.</p>
      </div>
    )
  }

  return (
    <div>
      <ScreenHeader title={data.titulo} onBack={() => navigate('/app/config')} ttsText={data.parrafos.join(' ')} />
      <div className="p-6 flex flex-col gap-4">
        {data.parrafos.map((p, i) => (
          <p key={i} className="text-ink/80 leading-relaxed">{p}</p>
        ))}
      </div>
    </div>
  )
}

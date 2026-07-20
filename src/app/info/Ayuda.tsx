import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Card } from '../../ui/Card'
import { FAQ } from '../../data/faq'

export function Ayuda() {
  const navigate = useNavigate()
  const [abierta, setAbierta] = useState<number | null>(null)
  return (
    <div>
      <ScreenHeader title="Preguntas frecuentes" onBack={() => navigate('/app/config')} />
      <div className="p-4 flex flex-col gap-3">
        {FAQ.map((f, i) => (
          <Card key={i} className="p-0 overflow-hidden">
            <button aria-expanded={abierta === i}
              className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
              onClick={() => setAbierta((prev) => (prev === i ? null : i))}>
              <span className="font-semibold text-navy-900">{f.pregunta}</span>
              <span aria-hidden="true" className="text-2xl leading-none text-navy-900">{abierta === i ? '−' : '+'}</span>
            </button>
            {abierta === i && <p className="px-4 pb-4 text-ink/80">{f.respuesta}</p>}
          </Card>
        ))}
        <p className="text-ink/70 mt-2">
          ¿Necesitás más ayuda? Llamanos al 147 o escribinos a (011) 5050-1470.
        </p>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useAccessibility } from '../state/hooks'
import { ScreenHeader } from '../layout/ScreenHeader'
import { Card } from '../ui/Card'
import { Toggle } from '../ui/Toggle'

const CUENTA = [
  { label: 'Políticas de privacidad', to: '/app/legal/privacidad' },
  { label: 'Términos y condiciones', to: '/app/legal/terminos' },
  { label: 'Objetivo de +Simple', to: '/app/legal/objetivo' },
  { label: 'Preguntas frecuentes', to: '/app/ayuda' },
]

export function Configuracion() {
  const navigate = useNavigate()
  const { largeText, highContrast, toggleLargeText, toggleHighContrast } = useAccessibility()
  return (
    <div>
      <ScreenHeader title="Configuración" />
      <div className="p-4 flex flex-col gap-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">Accesibilidad</h2>
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-lg">Textos grandes</span>
              <Toggle checked={largeText} onChange={toggleLargeText} label="Textos grandes" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg">Contrastes</span>
              <Toggle checked={highContrast} onChange={toggleHighContrast} label="Contrastes" />
            </div>
          </Card>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3">Mi cuenta</h2>
          <Card className="flex flex-col divide-y divide-chip/20">
            {CUENTA.map((r) => (
              <button key={r.to} onClick={() => navigate(r.to)}
                className="text-left py-3 text-lg">{r.label}</button>
            ))}
          </Card>
        </section>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buscarActualizacion, hayActualizacion } from '../pwa/actualizaciones'
import { useAccessibility } from '../state/hooks'
import { ScreenHeader } from '../layout/ScreenHeader'
import { Card } from '../ui/Card'
import { Toggle } from '../ui/Toggle'
import { TextSizeIcon, ContrastIcon, ShieldIcon, DocIcon, StarIcon, HelpIcon } from '../ui/icons'

const CUENTA = [
  { label: 'Políticas de privacidad', to: '/app/legal/privacidad', Icon: ShieldIcon },
  { label: 'Términos y condiciones', to: '/app/legal/terminos', Icon: DocIcon },
  { label: 'Objetivo de +Simple', to: '/app/legal/objetivo', Icon: StarIcon },
  { label: 'Preguntas frecuentes', to: '/app/ayuda', Icon: HelpIcon },
]

export function Configuracion() {
  const navigate = useNavigate()
  const { largeText, highContrast, toggleLargeText, toggleHighContrast } = useAccessibility()
  const [estado, setEstado] = useState<'idle' | 'buscando' | 'al-dia'>('idle')

  // Si hay versión nueva, la pantalla de actualización aparece sola; acá sólo
  // confirmamos cuando ya está todo al día.
  const buscar = async () => {
    setEstado('buscando')
    await buscarActualizacion()
    setEstado(hayActualizacion() ? 'idle' : 'al-dia')
  }
  return (
    <div>
      <ScreenHeader title="Configuración" />
      <div className="p-4 flex flex-col gap-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">Accesibilidad</h2>
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-3 text-lg">
                <TextSizeIcon className="h-6 w-6 text-navy-900 shrink-0" />
                Textos grandes
              </span>
              <Toggle checked={largeText} onChange={toggleLargeText} label="Textos grandes" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-3 text-lg">
                <ContrastIcon className="h-6 w-6 text-navy-900 shrink-0" />
                Contrastes
              </span>
              <Toggle checked={highContrast} onChange={toggleHighContrast} label="Contrastes" />
            </div>
          </Card>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3">Mi cuenta</h2>
          <Card className="flex flex-col divide-y divide-chip/20">
            {CUENTA.map(({ label, to, Icon }) => (
              <button key={to} onClick={() => navigate(to)}
                className="flex items-center gap-3 text-left py-3 text-lg">
                <Icon className="h-6 w-6 text-navy-900 shrink-0" />
                {label}
              </button>
            ))}
          </Card>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3">La app</h2>
          <Card className="flex flex-col gap-3">
            <p className="text-ink/70 leading-snug">
              +Simple queda guardada en tu teléfono y funciona sin internet. Buscá
              actualizaciones de vez en cuando para tener las últimas novedades.
            </p>
            <button
              onClick={buscar}
              disabled={estado === 'buscando'}
              className="self-start rounded-full bg-navy-900 text-white text-base font-semibold
                px-6 py-2.5 hover:bg-navy-800 disabled:opacity-70">
              {estado === 'buscando' ? 'Buscando…' : 'Buscar actualizaciones'}
            </button>
            {estado === 'al-dia' && (
              <p role="status" className="text-ink/70">Ya tenés la última versión.</p>
            )}
          </Card>
        </section>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../../layout/ScreenHeader'
import { Button } from '../../ui/Button'
import { useUser } from '../../state/hooks'
import { avatarDe } from '../../data/avatars'

const HABILIDADES = ['Paquete Office', 'Responsable', 'Empática', 'Paciente']

// Sección interna del CV: card blanca con título navy y contenido chico (frame 33)
function Seccion({ titulo, children, className = '' }: { titulo: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl bg-white border border-chip/25 shadow-sm px-3 py-2.5 ${className}`}>
      <h2 className="font-bold text-navy-900 mb-1">{titulo}</h2>
      {children}
    </div>
  )
}

export function CvPreliminar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useUser()
  const stateNombre = (location.state as { nombre?: string } | null)?.nombre
  const nombre = (stateNombre && stateNombre.trim())
    || (profile ? `${profile.nombre} ${profile.apellido}`.trim() : '')
    || 'Susana Martinez'
  const foto = profile?.fotoDataUrl ?? avatarDe(nombre)

  return (
    <div>
      <ScreenHeader title="CV" onBack={() => navigate('/app/empleo/experiencia')} />
      <div className="p-4 flex flex-col gap-4">
        {/* Documento CV: contenedor con borde y banner celeste (frame 33 del Figma) */}
        <div className="rounded-xl border-2 border-[#A9CBE8] overflow-hidden bg-[#F4F8FC]">
          <div className="bg-[#CCE2F4] px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-navy-900 truncate">{nombre}</h1>
              <p className="text-ink/70 text-sm">Profesora de Inglés</p>
            </div>
            {foto && (
              <img src={foto} alt="" className="h-14 w-14 rounded-full object-cover shrink-0" aria-hidden="true" />
            )}
          </div>
          <div className="p-3 flex flex-col gap-3">
            <Seccion titulo="Sobre mi">
              <p className="text-ink/80 text-sm">Soy profesora de inglés con 30 años de experiencia.</p>
            </Seccion>
            <div className="grid grid-cols-2 gap-3 items-start">
              <Seccion titulo="Educación">
                <p className="text-ink/80 text-sm">Profesorado en Lenguas Vivas</p>
              </Seccion>
              <Seccion titulo="Habilidades">
                {HABILIDADES.map((h) => (
                  <p key={h} className="text-ink/80 text-sm leading-snug">{h}</p>
                ))}
              </Seccion>
            </div>
            <Seccion titulo="Experiencia">
              <p className="text-ink/80 text-sm">Inmaculada Concepción de María (1992 – 2012)</p>
              <p className="text-ink/80 text-sm">Canadá School (2012 – 2022)</p>
            </Seccion>
          </div>
        </div>
        <Button onClick={() => navigate('/app/empleo')}>Guardar</Button>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { CARTAS_PRIVADAS } from '../../data/foro'

export function CartasPrivadas() {
  const navigate = useNavigate()
  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Sobres cerrados "Presioná para abrir" (frames 49-50 del Figma) */}
      {CARTAS_PRIVADAS.map((c) => (
        <button key={c.id} className="block text-left" onClick={() => navigate(`/app/foro/privada/${c.id}`)}>
          <div className="relative rounded-xl bg-[#F3EAD5] border border-[#D8CBAA] shadow-sm overflow-hidden">
            {/* Solapa del sobre */}
            <svg viewBox="0 0 100 22" className="w-full block" preserveAspectRatio="none" aria-hidden="true">
              <polygon points="0,0 100,0 50,22" fill="#EADFC4" stroke="#D8CBAA" strokeWidth="0.6" />
            </svg>
            {/* Sello redondo sobre la punta de la solapa */}
            <span aria-hidden="true"
              className="absolute left-1/2 top-7 -translate-x-1/2 h-8 w-8 rounded-full bg-navy-900/90
                grid place-items-center text-cream text-xs font-bold shadow">+S</span>
            <div className="px-4 pt-6 pb-4 text-center">
              <p className="text-lg text-ink">De: <span className="font-semibold">{c.de}</span></p>
              <p className="text-ink/50 text-sm">{c.fecha}</p>
              <p className="mt-1 text-navy-900 font-medium">Presioná para abrir</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

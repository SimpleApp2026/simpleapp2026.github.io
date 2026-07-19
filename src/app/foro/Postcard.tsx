import type { ReactNode } from 'react'
import { avatarDe } from '../../data/avatars'

export function Postcard(
  { autor, fecha, children, className = '' }:
  { autor: string; fecha?: string; children: ReactNode; className?: string },
) {
  const foto = avatarDe(autor)
  return (
    <div className={`relative bg-cream rounded-2xl p-5 shadow-sm border border-chip/20 ${className}`}>
      <span className="absolute top-3 right-4 text-2xl" aria-hidden="true">📮</span>
      <div className="flex items-center gap-3">
        {foto && <img src={foto} alt="" className="h-10 w-10 rounded-full object-cover" aria-hidden="true" />}
        <div>
          <p className="font-semibold text-navy-900">{autor}</p>
          {fecha && <p className="text-ink/50 text-sm">{fecha}</p>}
        </div>
      </div>
      <div className="text-ink/80 leading-relaxed mt-2">{children}</div>
    </div>
  )
}

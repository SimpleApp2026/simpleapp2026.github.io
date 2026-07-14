import type { ReactNode } from 'react'

export function Postcard(
  { autor, fecha, children, className = '' }:
  { autor: string; fecha?: string; children: ReactNode; className?: string },
) {
  return (
    <div className={`relative bg-cream rounded-2xl p-5 shadow-sm border border-chip/20 ${className}`}>
      <span className="absolute top-3 right-4 text-2xl" aria-hidden="true">📮</span>
      <p className="font-semibold text-navy-900">{autor}</p>
      {fecha && <p className="text-ink/50 text-sm mb-2">{fecha}</p>}
      <div className="text-ink/80 leading-relaxed">{children}</div>
    </div>
  )
}

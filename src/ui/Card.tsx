import type { ReactNode } from 'react'
export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`contrast-surface bg-surface rounded-2xl shadow-sm border border-chip/15 p-4 ${className}`}>{children}</div>
}

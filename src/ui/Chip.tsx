import type { ReactNode } from 'react'
export function Chip(
  { selected = false, onClick, children }:
  { selected?: boolean; onClick?: () => void; children: ReactNode },
) {
  return (
    <button type="button" onClick={onClick} aria-pressed={selected}
      className={`rounded-full px-4 py-2 text-base font-medium
        ${selected ? 'bg-primary text-white' : 'bg-chip/20 text-ink'}`}>
      {children}
    </button>
  )
}

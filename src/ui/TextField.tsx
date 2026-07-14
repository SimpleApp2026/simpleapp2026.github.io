import { useId, type ChangeEvent } from 'react'
export function TextField(
  { label, value, onChange, placeholder, type = 'text' }:
  { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string },
) {
  const id = useId()
  return (
    <label htmlFor={id} className="block mb-4">
      <span className="block mb-1 text-lg font-semibold">{label}</span>
      <input id={id} type={type} value={value} placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="contrast-surface w-full rounded-xl border border-chip/40 bg-surface px-4 py-3 text-lg" />
    </label>
  )
}

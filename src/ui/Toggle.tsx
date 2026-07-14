export function Toggle(
  { checked, onChange, label }:
  { checked: boolean; onChange: (v: boolean) => void; label: string },
) {
  return (
    <button role="switch" aria-checked={checked} aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 rounded-full transition ${checked ? 'bg-teal' : 'bg-chip/40'}`}>
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  )
}

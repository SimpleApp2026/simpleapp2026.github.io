import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

// Piezas compartidas de la experiencia "carta en papel" (frames 40-59 del Figma)

// Papel: color crema con manchas suaves de acuarela (sin imágenes externas)
export const PAPEL: CSSProperties = {
  backgroundColor: '#F6F0E3',
  backgroundImage: [
    'radial-gradient(ellipse 55% 38% at 18% 12%, rgba(213,196,166,0.30), transparent 62%)',
    'radial-gradient(ellipse 48% 32% at 88% 28%, rgba(221,206,178,0.26), transparent 60%)',
    'radial-gradient(ellipse 65% 42% at 38% 78%, rgba(209,190,158,0.24), transparent 65%)',
    'radial-gradient(ellipse 38% 28% at 78% 92%, rgba(224,211,185,0.28), transparent 60%)',
  ].join(', '),
}

// Estampilla postal (SVG inline: borde dentado navy, obelisco y "AR")
export function Estampilla({ className = 'h-16 w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 68" className={`${className} drop-shadow-sm`} aria-hidden="true">
      <rect x="1" y="1" width="54" height="66" rx="4" fill="#FDFBF5" stroke="#16154C"
        strokeWidth="2" strokeDasharray="4 3" />
      <rect x="7" y="7" width="42" height="54" fill="none" stroke="#16154C" strokeWidth="1.2" />
      <text x="42" y="16" fontSize="7" fontWeight="bold" fill="#16154C" textAnchor="middle">AR</text>
      <g stroke="#16154C" strokeWidth="1.6" fill="none" strokeLinejoin="round">
        <path d="M28 14 L24.5 20 L24.5 48 L31.5 48 L31.5 20 Z" />
        <line x1="18" y1="52" x2="38" y2="52" />
        <line x1="21" y1="48" x2="35" y2="48" />
      </g>
    </svg>
  )
}

// Textarea "invisible": sin borde ni fondo, crece con el contenido,
// placeholder gris y caret navy titilante sobre el papel.
export function TextoCarta(
  { value, onChange, placeholder, label, autoFocus = false, minRows = 3 }:
  { value: string; onChange: (v: string) => void; placeholder: string; label: string; autoFocus?: boolean; minRows?: number },
) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px` }
  }, [value])
  return (
    <textarea
      ref={ref}
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      rows={minRows}
      className="w-full resize-none overflow-hidden bg-transparent border-0 outline-none
        text-base leading-relaxed text-ink/85 placeholder:text-ink/40 caret-navy-900"
    />
  )
}

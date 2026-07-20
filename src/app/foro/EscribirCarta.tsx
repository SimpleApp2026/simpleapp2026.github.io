import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { MicIcon, SpeakerIcon } from '../../ui/icons'
import { useTts } from '../../state/hooks'

// ---------------------------------------------------------------------------
// Pantalla de escritura de carta (frames 40-42 del Figma "Tutorial Carta"):
// papel de fondo, estampilla arriba a la izquierda, "Siguiente" arriba a la
// derecha, mic/altavoz, indicador 1/3 y secciones-guía con textareas
// invisibles (solo placeholder + caret) sobre el papel.
// ---------------------------------------------------------------------------

// Papel: color crema con manchas suaves de acuarela (sin imágenes externas)
const PAPEL: CSSProperties = {
  backgroundColor: '#F6F0E3',
  backgroundImage: [
    'radial-gradient(ellipse 55% 38% at 18% 12%, rgba(213,196,166,0.30), transparent 62%)',
    'radial-gradient(ellipse 48% 32% at 88% 28%, rgba(221,206,178,0.26), transparent 60%)',
    'radial-gradient(ellipse 65% 42% at 38% 78%, rgba(209,190,158,0.24), transparent 65%)',
    'radial-gradient(ellipse 38% 28% at 78% 92%, rgba(224,211,185,0.28), transparent 60%)',
  ].join(', '),
}

// Estampilla postal (SVG inline: borde dentado navy, obelisco y "AR")
function Estampilla() {
  return (
    <svg viewBox="0 0 56 68" className="h-16 w-auto drop-shadow-sm" aria-hidden="true">
      <rect x="1" y="1" width="54" height="66" rx="4" fill="#FDFBF5" stroke="#16154C"
        strokeWidth="2" strokeDasharray="4 3" />
      <rect x="7" y="7" width="42" height="54" fill="none" stroke="#16154C" strokeWidth="1.2" />
      <text x="42" y="16" fontSize="7" fontWeight="bold" fill="#16154C" textAnchor="middle">AR</text>
      {/* Obelisco */}
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
function TextoCarta(
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

interface Seccion { titulo: string; placeholder: string; campo: number }

const PASOS: { secciones: Seccion[] }[] = [
  {
    secciones: [
      { campo: 0, titulo: 'Presentate', placeholder: '¡Hola! Me llamo Inés, y me llena de emoción escribirles desde mi ciudad...' },
      { campo: 1, titulo: 'Buscá puntos en común', placeholder: 'Me encantaría saber más sobre tus costumbres, tus hobbies y actividades que te gusta hacer en el tiempo libre. Por mi parte, me gusta mucho...' },
    ],
  },
  {
    secciones: [
      { campo: 2, titulo: 'Hacé preguntas', placeholder: 'Cuando tenés tiempo libre, ¿cuál es la actividad que más te gusta hacer?' },
      { campo: 3, titulo: 'Cerrá tu carta', placeholder: 'Si leíste mi carta te agradezco por tu tiempo. Estaré atenta a tu respuesta,' },
    ],
  },
]

export function EscribirCarta() {
  const navigate = useNavigate()
  const { speak } = useTts()
  const [paso, setPaso] = useState(0)
  const [campos, setCampos] = useState<string[]>(['', '', '', ''])
  const [cartaFinal, setCartaFinal] = useState('')

  const esRevision = paso === 2
  const setCampo = (i: number, v: string) =>
    setCampos((prev) => prev.map((c, j) => (j === i ? v : c)))

  const siguiente = () => {
    if (paso === 1) setCartaFinal((prev) => prev || campos.filter((c) => c.trim()).join('\n\n'))
    if (esRevision) {
      navigate('/app/foro/enviada', { state: { destino: 'el foro público' } })
    } else {
      setPaso((p) => p + 1)
    }
  }

  const leer = () => {
    const contenido = esRevision
      ? `Revisá tu carta. ${cartaFinal || 'Todavía no escribiste tu carta.'}`
      : PASOS[paso].secciones.map((s) => `${s.titulo}. ${campos[s.campo] || s.placeholder}`).join(' ')
    speak(contenido)
  }

  return (
    <div className="min-h-full flex flex-col px-5 pt-4 pb-8" style={PAPEL}>
      {/* Cabecera del papel: estampilla + Siguiente/Enviar */}
      <div className="flex items-start justify-between">
        <Estampilla />
        <button
          onClick={siguiente}
          className="rounded-full border-2 border-navy-900 bg-transparent text-navy-900
            px-6 py-1.5 text-base font-semibold hover:bg-navy-900 hover:text-white transition">
          {esRevision ? 'Enviar' : 'Siguiente'}
        </button>
      </div>

      {/* Mic (decorativo) + altavoz (lee la pantalla) */}
      <div className="flex justify-end items-center gap-3 mt-2 text-navy-900">
        <MicIcon className="h-6 w-6" />
        <button aria-label="Leer en voz alta" onClick={leer}>
          <SpeakerIcon className="h-6 w-6" />
        </button>
      </div>

      <p className="text-ink/45 text-sm mt-1">{paso + 1}/3</p>

      {esRevision ? (
        <>
          <h1 className="font-display text-3xl font-bold text-ink mt-1">Revisá tu carta</h1>
          <p className="text-ink/60 text-sm mt-1 mb-3">
            Pulsá sobre el texto para editar y corregir cada parte que consideres.
          </p>
          <TextoCarta
            label="Revisá tu carta"
            value={cartaFinal}
            onChange={setCartaFinal}
            placeholder="Tu carta aparecerá acá..."
            autoFocus
            minRows={10}
          />
        </>
      ) : (
        PASOS[paso].secciones.map((s, idx) => (
          <div key={s.titulo} className={idx === 0 ? 'mt-1' : 'mt-6'}>
            <h1 className="font-display text-3xl font-bold text-ink mb-1">{s.titulo}</h1>
            <TextoCarta
              label={s.titulo}
              value={campos[s.campo]}
              onChange={(v) => setCampo(s.campo, v)}
              placeholder={s.placeholder}
              autoFocus={idx === 0}
            />
          </div>
        ))
      )}
    </div>
  )
}

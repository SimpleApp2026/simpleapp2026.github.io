import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MicIcon, SpeakerIcon } from '../../ui/icons'
import { useTts } from '../../state/hooks'
import { PAPEL, Estampilla, TextoCarta } from './paper'

// ---------------------------------------------------------------------------
// Pantalla de escritura de carta (frames 40-42 del Figma "Tutorial Carta"):
// papel de fondo, estampilla arriba a la izquierda, "Siguiente" arriba a la
// derecha, mic/altavoz, indicador 1/3 y secciones-guía con textareas
// invisibles (solo placeholder + caret) sobre el papel.
// ---------------------------------------------------------------------------

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

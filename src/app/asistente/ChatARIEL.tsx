import { useState } from 'react'
import { useUser, useTts } from '../../state/hooks'
import { Chip } from '../../ui/Chip'
import {
  MicIcon, SpeakerIcon, SendIcon, CameraIcon, ImageIcon, FolderIcon, HeadphonesIcon,
  CopyIcon, ThumbUpIcon, ThumbDownIcon, CheckIcon,
} from '../../ui/icons'
import { greeting, arielRespond, QUICK_REPLIES, SUGERENCIAS, type ChatMsg } from '../../data/ariel'
import arielImg from '../../assets/img/ariel.png'

function horaActual(): string {
  return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function ChatARIEL() {
  const { profile } = useUser()
  const { speak } = useTts()
  const [mensajes, setMensajes] = useState<ChatMsg[]>([
    { id: 'greeting', from: 'ariel', texto: greeting(profile?.nombre), hora: horaActual() },
  ])
  const [texto, setTexto] = useState('')
  const [voto, setVoto] = useState<Record<string, 'si' | 'no'>>({})

  const enviar = (contenido: string) => {
    const t = contenido.trim()
    if (!t) return
    const hora = horaActual()
    setMensajes((prev) => [
      ...prev,
      { id: `u-${prev.length}`, from: 'user', texto: t, hora },
      { id: `a-${prev.length}`, from: 'ariel', texto: arielRespond(t), hora },
    ])
    setTexto('')
  }

  const soloSaludo = mensajes.length === 1
  const miFoto = profile?.fotoDataUrl

  return (
    <div className="flex flex-col h-full">
      <header className="bg-navy-900 text-white px-4 py-3 flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-teal/30 overflow-hidden grid place-items-center" aria-hidden="true">
          <img src={arielImg} alt="" className="h-9 w-9 object-contain translate-y-0.5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">ARIEL</p>
          <p className="text-xs text-teal">En línea</p>
        </div>
        <MicIcon className="h-6 w-6 opacity-90" />
        <button aria-label="Leer en voz alta" onClick={() => speak(mensajes[mensajes.length - 1].texto)}>
          <SpeakerIcon className="h-6 w-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {mensajes.map((m) => (
          m.from === 'ariel' ? (
            // ARIEL: avatar a la izquierda, burbuja navy, acciones y hora debajo
            <div key={m.id} className="self-start max-w-[88%] flex items-end gap-2">
              <img src={arielImg} alt="" className="h-9 w-9 shrink-0 object-contain" aria-hidden="true" />
              <div className="min-w-0">
                <div className="rounded-2xl rounded-bl-sm bg-navy-900 text-white px-4 py-2 text-base">{m.texto}</div>
                <div className="mt-1 flex items-center gap-2 text-ink/45">
                  <span className="text-xs">{m.hora}</span>
                  <button aria-label="Copiar respuesta" onClick={() => navigator.clipboard?.writeText(m.texto)}
                    className="p-0.5 hover:text-ink/70"><CopyIcon className="h-4 w-4" /></button>
                  <button aria-label="Me sirvió" aria-pressed={voto[m.id] === 'si'}
                    onClick={() => setVoto((v) => ({ ...v, [m.id]: 'si' }))}
                    className={`p-0.5 hover:text-ink/70 ${voto[m.id] === 'si' ? 'text-navy-900' : ''}`}>
                    <ThumbUpIcon className="h-4 w-4" />
                  </button>
                  <button aria-label="No me sirvió" aria-pressed={voto[m.id] === 'no'}
                    onClick={() => setVoto((v) => ({ ...v, [m.id]: 'no' }))}
                    className={`p-0.5 hover:text-ink/70 ${voto[m.id] === 'no' ? 'text-navy-900' : ''}`}>
                    <ThumbDownIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Usuario: burbuja gris, hora con tilde de enviado y su foto a la derecha
            <div key={m.id} className="self-end max-w-[85%] flex items-end gap-2">
              <div className="min-w-0">
                <div className="rounded-2xl rounded-br-sm bg-[#E4E7E8] text-navy-800 px-4 py-2 text-base">{m.texto}</div>
                <div className="mt-1 flex items-center justify-end gap-1 text-ink/45 text-xs">
                  <span>{m.hora}</span>
                  <CheckIcon className="h-3.5 w-3.5" />
                </div>
              </div>
              {miFoto
                ? <img src={miFoto} alt={profile?.nombre ?? 'Vos'} className="h-9 w-9 shrink-0 rounded-full object-cover" />
                : <div className="h-9 w-9 shrink-0 rounded-full bg-chip/30 grid place-items-center text-sm" aria-hidden="true">👤</div>}
            </div>
          )
        ))}

        {/* Tarjetas de ayuda del Figma, sólo mientras no hay conversación */}
        {soloSaludo && (
          <div className="mt-2 grid grid-cols-2 gap-3">
            {SUGERENCIAS.map((s) => (
              <button key={s.titulo} onClick={() => enviar(s.pregunta)}
                className="text-left rounded-2xl bg-[#F2F6FA] px-4 py-3 hover:bg-[#E7EFF7] transition">
                <p className="font-semibold text-navy-900 leading-snug">{s.titulo}</p>
                <p className="text-sm text-ink/60 leading-snug mt-1">{s.detalle}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-3 py-2 flex gap-2 overflow-x-auto">
        {QUICK_REPLIES.map((q) => (
          <Chip key={q} onClick={() => enviar(q)}>{q}</Chip>
        ))}
      </div>

      {/* Barra de entrada como en el Figma: cámara / imagen / archivo + input con
          mic y enviar + auriculares (decorativos, sin funcionalidad) sobre fondo mint */}
      <form className="px-2 py-2 flex items-center gap-1.5 bg-teal/40"
        onSubmit={(e) => { e.preventDefault(); enviar(texto) }}>
        <button type="button" aria-label="Sacar foto" className="p-1 text-navy-800 shrink-0">
          <CameraIcon className="h-6 w-6" />
        </button>
        <button type="button" aria-label="Subir imagen" className="p-1 text-navy-800 shrink-0">
          <ImageIcon className="h-6 w-6" />
        </button>
        <button type="button" aria-label="Subir archivo" className="p-1 text-navy-800 shrink-0">
          <FolderIcon className="h-6 w-6" />
        </button>
        <div className="min-w-0 flex-1 flex items-center gap-1 rounded-full bg-surface border border-chip/30 pl-3 pr-1 py-1">
          <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribí acá..."
            aria-label="Escribí un mensaje para ARIEL"
            className="min-w-0 flex-1 bg-transparent text-base outline-none" />
          <button type="button" aria-label="Grabar audio" className="p-1 text-navy-800">
            <MicIcon className="h-5 w-5" />
          </button>
          <button type="submit" aria-label="Enviar"
            className="h-9 w-9 grid place-items-center rounded-full bg-primary text-white shrink-0">
            <SendIcon className="h-4 w-4" />
          </button>
        </div>
        <button type="button" aria-label="Escuchar con auriculares" className="p-1.5 text-navy-800">
          <HeadphonesIcon className="h-6 w-6" />
        </button>
      </form>
    </div>
  )
}

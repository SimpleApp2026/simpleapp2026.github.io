import { useState } from 'react'
import { useUser, useTts } from '../../state/hooks'
import { Chip } from '../../ui/Chip'
import { MicIcon, SpeakerIcon, SendIcon } from '../../ui/icons'
import { greeting, arielRespond, QUICK_REPLIES, type ChatMsg } from '../../data/ariel'

export function ChatARIEL() {
  const { profile } = useUser()
  const { speak } = useTts()
  const [mensajes, setMensajes] = useState<ChatMsg[]>([
    { id: 'greeting', from: 'ariel', texto: greeting(profile?.nombre) },
  ])
  const [texto, setTexto] = useState('')

  const enviar = (contenido: string) => {
    const t = contenido.trim()
    if (!t) return
    setMensajes((prev) => [
      ...prev,
      { id: `u-${prev.length}`, from: 'user', texto: t },
      { id: `a-${prev.length}`, from: 'ariel', texto: arielRespond(t) },
    ])
    setTexto('')
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-navy-900 text-white px-4 py-3 flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-teal/30 grid place-items-center text-xl" aria-hidden="true">🧑‍🦰</div>
        <div className="flex-1">
          <p className="font-semibold">ARIEL</p>
          <p className="text-xs text-teal">En línea</p>
        </div>
        <MicIcon className="h-6 w-6 opacity-90" />
        <button aria-label="Leer en voz alta" onClick={() => speak(mensajes[mensajes.length - 1].texto)}>
          <SpeakerIcon className="h-6 w-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {mensajes.map((m) => (
          <div key={m.id} className={m.from === 'user' ? 'self-end max-w-[80%]' : 'self-start max-w-[80%]'}>
            <div className={`rounded-2xl px-4 py-2 text-base ${m.from === 'user' ? 'bg-navy-800 text-white' : 'bg-surface text-ink border border-chip/20'}`}>
              {m.texto}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 py-2 flex gap-2 overflow-x-auto">
        {QUICK_REPLIES.map((q) => (
          <Chip key={q} onClick={() => enviar(q)}>{q}</Chip>
        ))}
      </div>

      <form className="p-3 flex items-center gap-2 border-t border-chip/20"
        onSubmit={(e) => { e.preventDefault(); enviar(texto) }}>
        <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribí acá..."
          className="flex-1 rounded-full border border-chip/40 px-4 py-2 text-base" />
        <button type="submit" aria-label="Enviar"
          className="h-11 w-11 grid place-items-center rounded-full bg-primary text-white">
          <SendIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}

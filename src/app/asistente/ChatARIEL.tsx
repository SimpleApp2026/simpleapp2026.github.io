import { useState } from 'react'
import { useUser, useTts } from '../../state/hooks'
import { Chip } from '../../ui/Chip'
import { MicIcon, SpeakerIcon, SendIcon, CameraIcon, ImageIcon, FolderIcon, HeadphonesIcon } from '../../ui/icons'
import { greeting, arielRespond, QUICK_REPLIES, type ChatMsg } from '../../data/ariel'
import arielImg from '../../assets/img/ariel.png'

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

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {mensajes.map((m) => (
          <div key={m.id} className={m.from === 'user' ? 'self-end max-w-[80%]' : 'self-start max-w-[85%] flex items-end gap-2'}>
            {m.from === 'ariel' && (
              <img src={arielImg} alt="" className="h-8 w-8 shrink-0 object-contain" aria-hidden="true" />
            )}
            {/* Burbujas como en el Figma: ARIEL en azul de la app con letras blancas;
                usuario en gris claro con letras azules */}
            <div className={`rounded-2xl px-4 py-2 text-base ${m.from === 'user' ? 'bg-[#E4E7E8] text-navy-800' : 'bg-navy-900 text-white'}`}>
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

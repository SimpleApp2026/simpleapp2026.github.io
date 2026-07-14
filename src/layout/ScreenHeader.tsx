import { useTts } from '../state/hooks'
import { BackIcon, MicIcon, SpeakerIcon } from '../ui/icons'

export function ScreenHeader(
  { title, onBack, ttsText }:
  { title: string; onBack?: () => void; ttsText?: string },
) {
  const { speak } = useTts()
  return (
    <header className="bg-navy-900 text-white px-4 py-4 flex items-center gap-3">
      {onBack && (
        <button aria-label="Volver" onClick={onBack}
          className="grid place-items-center h-10 w-10 rounded-full bg-teal text-navy-900">
          <BackIcon className="h-6 w-6" />
        </button>
      )}
      <h1 className="text-xl font-semibold flex-1">{title}</h1>
      <MicIcon className="h-6 w-6 opacity-90" />
      <button aria-label="Leer en voz alta" onClick={() => speak(ttsText ?? title)}>
        <SpeakerIcon className="h-6 w-6" />
      </button>
    </header>
  )
}

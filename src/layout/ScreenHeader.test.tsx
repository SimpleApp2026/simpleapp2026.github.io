import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScreenHeader } from './ScreenHeader'
import { TtsProvider } from '../state/TtsProvider'

test('speaker button reads the tts text', async () => {
  const speakSpy = vi.fn()
  ;(window as any).speechSynthesis = { speak: speakSpy, cancel: vi.fn() }
  ;(window as any).SpeechSynthesisUtterance = class { text=''; lang=''; constructor(t:string){this.text=t} }
  render(<TtsProvider><ScreenHeader title="Perfil" ttsText="Esta es tu página de perfil" /></TtsProvider>)
  await userEvent.click(screen.getByRole('button', { name: /leer/i }))
  expect(speakSpy).toHaveBeenCalled()
  expect(speakSpy.mock.calls[0][0].text).toBe('Esta es tu página de perfil')
})

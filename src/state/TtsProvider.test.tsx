import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TtsProvider } from './TtsProvider'
import { useTts } from './hooks'

function Probe() {
  const { speak, supported } = useTts()
  return <button onClick={() => speak('hola mundo')}>{supported ? 'on' : 'off'}</button>
}

test('speak() sends an utterance to speechSynthesis', async () => {
  const speakSpy = vi.fn()
  ;(window as any).speechSynthesis = { speak: speakSpy, cancel: vi.fn() }
  ;(window as any).SpeechSynthesisUtterance = class { text = ''; lang = ''; constructor(t: string){ this.text = t } }

  render(<TtsProvider><Probe /></TtsProvider>)
  await userEvent.click(screen.getByText('on'))
  expect(speakSpy).toHaveBeenCalledTimes(1)
  expect(speakSpy.mock.calls[0][0].text).toBe('hola mundo')
})

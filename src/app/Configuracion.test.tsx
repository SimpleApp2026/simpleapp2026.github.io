import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Configuracion } from './Configuracion'
import { AccessibilityProvider } from '../state/AccessibilityProvider'
import { TtsProvider } from '../state/TtsProvider'

function setup() {
  return render(
    <AccessibilityProvider><TtsProvider><MemoryRouter initialEntries={['/app/config']}>
      <Routes>
        <Route path="/app/config" element={<Configuracion />} />
        <Route path="/app/ayuda" element={<div>Pantalla ayuda</div>} />
      </Routes>
    </MemoryRouter></TtsProvider></AccessibilityProvider>,
  )
}
beforeEach(() => { localStorage.clear(); document.documentElement.className = '' })

test('large-text toggle flips state and applies the root class', async () => {
  setup()
  const sw = screen.getByRole('switch', { name: /Textos grandes/i })
  expect(sw).toHaveAttribute('aria-checked', 'false')
  await userEvent.click(sw)
  expect(sw).toHaveAttribute('aria-checked', 'true')
  expect(document.documentElement).toHaveClass('a11y-large')
})

test('account rows navigate', async () => {
  setup()
  await userEvent.click(screen.getByText('Preguntas frecuentes'))
  expect(screen.getByText('Pantalla ayuda')).toBeInTheDocument()
})

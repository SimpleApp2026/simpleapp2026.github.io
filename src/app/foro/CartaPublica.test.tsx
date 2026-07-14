import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartaPublica } from './CartaPublica'
import { TtsProvider } from '../../state/TtsProvider'

function setup(path: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/foro/carta/:id" element={<CartaPublica />} />
        <Route path="/app/foro" element={<div>Foro</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('shows the letter, its comments, and can add one', async () => {
  setup('/app/foro/carta/oscar')
  expect(screen.getByText(/Mi nombre es Oscar/)).toBeInTheDocument()
  expect(screen.getByText('Hola Oscar, un gusto.')).toBeInTheDocument()
  await userEvent.type(screen.getByLabelText(/Escribí un comentario/i), '¡Qué bueno leerte!')
  await userEvent.click(screen.getByRole('button', { name: /Comentar/i }))
  expect(screen.getByText('¡Qué bueno leerte!')).toBeInTheDocument()
})

test('unknown letter shows not found', () => {
  setup('/app/foro/carta/zzz')
  expect(screen.getByText(/no encontrada/i)).toBeInTheDocument()
})

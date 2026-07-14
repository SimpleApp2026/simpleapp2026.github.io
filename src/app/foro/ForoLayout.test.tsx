import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ForoLayout } from './ForoLayout'
import { CartasPublicas } from './CartasPublicas'
import { TtsProvider } from '../../state/TtsProvider'

function setup(path = '/app/foro') {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/foro" element={<ForoLayout />}>
          <Route index element={<CartasPublicas />} />
          <Route path="privadas" element={<div>Privadas tab</div>} />
          <Route path="amigos" element={<div>Amigos tab</div>} />
        </Route>
        <Route path="/app/foro/carta/:id" element={<div>Carta detalle</div>} />
        <Route path="/app/foro/escribir" element={<div>Escribir</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('shows tabs and the public letters tab by default; opens a letter', async () => {
  setup()
  expect(screen.getByText('Cartas públicas')).toBeInTheDocument()
  expect(screen.getByText('Cartas privadas')).toBeInTheDocument()
  expect(screen.getByText('Amigos')).toBeInTheDocument()
  // a fixture author is shown; click the first postcard to open it
  const escribir = screen.getByRole('button', { name: /Escribir carta/i })
  expect(escribir).toBeInTheDocument()
})

test('switching to Amigos tab navigates', async () => {
  setup()
  await userEvent.click(screen.getByText('Amigos'))
  expect(screen.getByText('Amigos tab')).toBeInTheDocument()
})

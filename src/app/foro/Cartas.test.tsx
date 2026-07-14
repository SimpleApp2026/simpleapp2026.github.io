import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { EscribirCarta } from './EscribirCarta'
import { CartaEnviada } from './CartaEnviada'
import { CartasPrivadas } from './CartasPrivadas'
import { CartaPrivada } from './CartaPrivada'
import { Responder } from './Responder'
import { TtsProvider } from '../../state/TtsProvider'

function router(initial: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/app/foro" element={<div>Foro</div>} />
        <Route path="/app/foro/escribir" element={<EscribirCarta />} />
        <Route path="/app/foro/enviada" element={<CartaEnviada />} />
        <Route path="/app/foro/privadas" element={<CartasPrivadas />} />
        <Route path="/app/foro/privada/:id" element={<CartaPrivada />} />
        <Route path="/app/foro/privada/:id/responder" element={<Responder />} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('composing a public letter confirms it was sent', async () => {
  router('/app/foro/escribir')
  await userEvent.type(screen.getByLabelText(/Escribí tu carta/i), 'Hola a todos')
  await userEvent.click(screen.getByRole('button', { name: /Enviar/i }))
  expect(screen.getByText(/¡Felicitaciones!/i)).toBeInTheDocument()
  expect(screen.getByText(/foro público/i)).toBeInTheDocument()
})

test('opening and replying to a private letter confirms with the friend name', async () => {
  router('/app/foro/privadas')
  await userEvent.click(screen.getByText('Sergio'))
  expect(screen.getByText(/Hola Amiga/)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /Responder/i }))
  await userEvent.type(screen.getByLabelText(/Escribí tu carta/i), 'Estoy mucho mejor, gracias')
  await userEvent.click(screen.getByRole('button', { name: /Enviar/i }))
  expect(screen.getByText(/Sergio/)).toBeInTheDocument()
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Amigos } from './Amigos'
import { CartaPrivada } from './CartaPrivada'
import { Responder } from './Responder'
import { CartaEnviada } from './CartaEnviada'
import { UserProvider } from '../../state/UserProvider'
import { TtsProvider } from '../../state/TtsProvider'

function setup() {
  return render(
    <UserProvider><TtsProvider><MemoryRouter initialEntries={['/app/foro/amigos']}>
      <Routes>
        <Route path="/app/foro/amigos" element={<Amigos />} />
        <Route path="/app/foro/privadas" element={<div>Cartas privadas</div>} />
        <Route path="/app/foro/privada/:id" element={<CartaPrivada />} />
        <Route path="/app/foro/privada/:id/responder" element={<Responder />} />
        <Route path="/app/foro/enviada" element={<CartaEnviada />} />
      </Routes>
    </MemoryRouter></TtsProvider></UserProvider>,
  )
}

test('cada amigo abre su carta (también Norma y Roberto)', async () => {
  setup()
  await userEvent.click(screen.getByText(/Ponete al día con Roberto/i))
  expect(screen.getByText(/una confitería nueva cerca de la plaza/i)).toBeInTheDocument()
})

test('al responder y enviar desde Amigos se vuelve a Amigos, no a Cartas privadas', async () => {
  setup()
  await userEvent.click(screen.getByText(/Ponete al día con Sergio/i))
  await userEvent.click(screen.getByRole('button', { name: /Responder/i }))
  await userEvent.type(screen.getByLabelText('Escribí tu carta'), 'Nos vemos mañana, Sergio')
  await userEvent.click(screen.getByRole('button', { name: /^Enviar$/ }))
  expect(screen.getByText(/Tu carta fue enviada a Sergio/i)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /^Ok$/ }))
  expect(screen.getByText(/Ponete al día con Norma/i)).toBeInTheDocument()
})

test('el botón atrás desde una carta abierta en Amigos vuelve a Amigos', async () => {
  setup()
  await userEvent.click(screen.getByText(/Ponete al día con Norma/i))
  expect(screen.getByText(/la juntada del sábado/i)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /Volver/i }))
  expect(screen.getByText(/Ponete al día con Sergio/i)).toBeInTheDocument()
})

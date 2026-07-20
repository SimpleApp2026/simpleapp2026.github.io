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

test('composing a public letter walks the 3 guided steps and confirms it was sent', async () => {
  router('/app/foro/escribir')
  // Paso 1/3: Presentate + Buscá puntos en común
  expect(screen.getByText('1/3')).toBeInTheDocument()
  await userEvent.type(screen.getByLabelText('Presentate'), 'Hola, soy Susana')
  await userEvent.type(screen.getByLabelText('Buscá puntos en común'), 'Me gusta la jardinería')
  await userEvent.click(screen.getByRole('button', { name: /Siguiente/i }))
  // Paso 2/3: Hacé preguntas + Cerrá tu carta
  expect(screen.getByText('2/3')).toBeInTheDocument()
  await userEvent.type(screen.getByLabelText('Hacé preguntas'), '¿Qué les gusta hacer?')
  await userEvent.click(screen.getByRole('button', { name: /Siguiente/i }))
  // Paso 3/3: revisión con las partes unidas y editable
  expect(screen.getByText('3/3')).toBeInTheDocument()
  const revision = screen.getByLabelText('Revisá tu carta') as HTMLTextAreaElement
  expect(revision.value).toContain('Hola, soy Susana')
  expect(revision.value).toContain('¿Qué les gusta hacer?')
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

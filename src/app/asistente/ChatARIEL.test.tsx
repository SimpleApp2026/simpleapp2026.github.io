import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ChatARIEL } from './ChatARIEL'
import { UserProvider } from '../../state/UserProvider'
import { TtsProvider } from '../../state/TtsProvider'
import type { Profile } from '../../types'

const susana: Profile = { nombre: 'Susana', apellido: 'M', barrio: '', fechaNacimiento: '', fotoDataUrl: null, intereses: [] }

// Seed the profile into localStorage BEFORE render so UserProvider rehydrates it
// on mount — the greeting is computed from profile at ChatARIEL's first render
// (this mirrors the real app, where the profile is already loaded from storage).
function setup() {
  localStorage.setItem('simple.user', JSON.stringify({ profile: susana, identified: true }))
  return render(
    <UserProvider><TtsProvider><MemoryRouter>
      <ChatARIEL />
    </MemoryRouter></TtsProvider></UserProvider>,
  )
}
beforeEach(() => localStorage.clear())

test('greets by name and answers a typed question', async () => {
  setup()
  expect(screen.getByText(/Hola Susana/)).toBeInTheDocument()
  await userEvent.type(screen.getByPlaceholderText(/Escribí acá/i), '¿Qué actividades hay esta semana?')
  await userEvent.click(screen.getByRole('button', { name: /Enviar/i }))
  expect(screen.getByText('¿Qué actividades hay esta semana?')).toBeInTheDocument()
  expect(screen.getByText(/Yoga en plaza Vicente López/)).toBeInTheDocument()
})

test('a quick reply sends and gets an answer', async () => {
  setup()
  await userEvent.click(screen.getByRole('button', { name: /Noticias de hoy/i }))
  expect(screen.getByText(/noticias más importantes/i)).toBeInTheDocument()
})

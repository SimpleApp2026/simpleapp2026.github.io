import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { RegistroDatos } from './RegistroDatos'
import { UserProvider, } from '../state/UserProvider'
import { TtsProvider } from '../state/TtsProvider'
import { useUser } from '../state/hooks'

function ProfileShow() {
  const { profile } = useUser()
  return <div>perfil: {profile ? `${profile.nombre} ${profile.apellido}` : 'ninguno'}</div>
}

function setup() {
  return render(
    <UserProvider><TtsProvider>
      <MemoryRouter initialEntries={['/registro/datos']}>
        <Routes>
          <Route path="/registro/datos" element={<RegistroDatos />} />
          <Route path="/registro/intereses" element={<ProfileShow />} />
        </Routes>
      </MemoryRouter>
    </TtsProvider></UserProvider>,
  )
}

beforeEach(() => localStorage.clear())

test('Continuar is disabled until required fields + T&C are filled', async () => {
  setup()
  expect(screen.getByRole('button', { name: /Continuar/i })).toBeDisabled()
  await userEvent.type(screen.getByLabelText('Nombre'), 'Susana')
  await userEvent.type(screen.getByLabelText('Apellido'), 'Martinez')
  await userEvent.click(screen.getByLabelText(/Acepto los términos/i))
  expect(screen.getByRole('button', { name: /Continuar/i })).toBeEnabled()
})

test('submitting saves the profile and navigates', async () => {
  setup()
  await userEvent.type(screen.getByLabelText('Nombre'), 'Susana')
  await userEvent.type(screen.getByLabelText('Apellido'), 'Martinez')
  await userEvent.type(screen.getByLabelText('Barrio'), 'Recoleta')
  await userEvent.click(screen.getByLabelText(/Acepto los términos/i))
  await userEvent.click(screen.getByRole('button', { name: /Continuar/i }))
  expect(screen.getByText('perfil: Susana Martinez')).toBeInTheDocument()
})

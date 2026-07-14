import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { RegistroIntereses } from './RegistroIntereses'
import { UserProvider } from '../state/UserProvider'
import { TtsProvider } from '../state/TtsProvider'
import { useUser } from '../state/hooks'
import type { Profile } from '../types'

const base: Profile = { nombre: 'Susana', apellido: 'M', barrio: '', fechaNacimiento: '', fotoDataUrl: null, intereses: [] }

function IntShow() {
  const { profile } = useUser()
  return <div>intereses: {(profile?.intereses ?? []).join(',')}</div>
}

function Seed() {
  const { setProfile } = useUser()
  return <button onClick={() => setProfile(base)}>seed</button>
}

function setup() {
  return render(
    <UserProvider><TtsProvider>
      <MemoryRouter initialEntries={['/seed']}>
        <Routes>
          <Route path="/seed" element={<><Seed /><RegistroIntereses /></>} />
          <Route path="/registro/foto" element={<IntShow />} />
        </Routes>
      </MemoryRouter>
    </TtsProvider></UserProvider>,
  )
}

beforeEach(() => localStorage.clear())

test('selecting interests updates the profile and navigates', async () => {
  setup()
  await userEvent.click(screen.getByText('seed'))
  await userEvent.click(screen.getByRole('button', { name: /Gastronomía/i }))
  await userEvent.click(screen.getByRole('button', { name: /Jardinería/i }))
  await userEvent.click(screen.getByRole('button', { name: /Continuar/i }))
  expect(screen.getByText('intereses: Gastronomía,Jardinería')).toBeInTheDocument()
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Home } from './Home'
import { UserProvider } from '../state/UserProvider'
import { TtsProvider } from '../state/TtsProvider'
import { useUser } from '../state/hooks'
import type { Profile } from '../types'

const susana: Profile = { nombre: 'Susana', apellido: 'M', barrio: 'Recoleta', fechaNacimiento: '1956-10-17', fotoDataUrl: null, intereses: [] }
function Seed({ p }: { p: Profile | null }) {
  const { setProfile } = useUser()
  return <button onClick={() => p && setProfile(p)}>seed</button>
}
function setup(seedProfile: Profile | null) {
  return render(
    <UserProvider><TtsProvider>
      <MemoryRouter initialEntries={['/app/home']}>
        <Routes>
          <Route path="/app/home" element={<><Seed p={seedProfile} /><Home /></>} />
          <Route path="/app/actividades" element={<div>Pantalla actividades</div>} />
          <Route path="/app/config" element={<div>Pantalla config</div>} />
        </Routes>
      </MemoryRouter>
    </TtsProvider></UserProvider>,
  )
}
beforeEach(() => localStorage.clear())

test('greets by name when a profile exists and cards navigate', async () => {
  setup(susana)
  await userEvent.click(screen.getByText('seed'))
  expect(screen.getByText(/Hola, Susana/)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /Actividades/i }))
  expect(screen.getByText('Pantalla actividades')).toBeInTheDocument()
})

test('does not crash and greets generically when profile is null', () => {
  setup(null)
  expect(screen.getByText(/Hola/)).toBeInTheDocument()
})

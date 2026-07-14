import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import { Perfil } from './Perfil'
import { UserProvider } from '../state/UserProvider'
import { TtsProvider } from '../state/TtsProvider'
import { useUser } from '../state/hooks'
import type { Profile } from '../types'

const susana: Profile = { nombre: 'Susana', apellido: 'Martinez', barrio: 'Recoleta', fechaNacimiento: '1956-10-17', fotoDataUrl: null, intereses: ['Jardinería'] }
function Seed({ p }: { p: Profile | null }) { const { setProfile } = useUser(); return <button onClick={() => p && setProfile(p)}>seed</button> }
function setup(p: Profile | null) {
  return render(
    <UserProvider><TtsProvider><MemoryRouter initialEntries={['/app/perfil']}>
      <Routes>
        <Route path="/app/perfil" element={<><Seed p={p} /><Perfil /></>} />
        <Route path="/registro/datos" element={<div>Registro datos</div>} />
      </Routes>
    </MemoryRouter></TtsProvider></UserProvider>,
  )
}
beforeEach(() => localStorage.clear())

test('renders profile details and interests', async () => {
  // Pin "today" so the age (susana turns 70 on 1956-10-17 + 70y) is
  // deterministic regardless of the real calendar date the suite runs on.
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 9, 20))
  try {
    setup(susana)
    await userEvent.click(screen.getByText('seed'))
    expect(screen.getByText('Susana Martinez')).toBeInTheDocument()
    expect(screen.getByText(/Edad 7\d/)).toBeInTheDocument()
    expect(screen.getByText('Jardinería')).toBeInTheDocument()
  } finally {
    vi.useRealTimers()
  }
})

test('editing and saving updates the profile', async () => {
  setup(susana)
  await userEvent.click(screen.getByText('seed'))
  await userEvent.click(screen.getByRole('button', { name: /Editar/i }))
  const barrio = screen.getByLabelText('Barrio')
  await userEvent.clear(barrio)
  await userEvent.type(barrio, 'Palermo')
  await userEvent.click(screen.getByRole('button', { name: /Guardar/i }))
  expect(screen.getByText(/Barrio de Palermo/)).toBeInTheDocument()
})

test('null profile shows a completar prompt', () => {
  setup(null)
  expect(screen.getByText(/Completá tu perfil/i)).toBeInTheDocument()
})

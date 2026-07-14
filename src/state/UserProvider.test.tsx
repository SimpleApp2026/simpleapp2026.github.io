import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserProvider } from './UserProvider'
import { useUser } from './hooks'
import type { Profile } from '../types'

const sample: Profile = {
  nombre: 'Susana', apellido: 'Martinez', barrio: 'Recoleta',
  fechaNacimiento: '1956-10-17', fotoDataUrl: null, intereses: ['Jardinería'],
}

function Probe() {
  const { profile, setProfile } = useUser()
  return <button onClick={() => setProfile(sample)}>{profile ? profile.nombre : 'sin perfil'}</button>
}

beforeEach(() => localStorage.clear())

test('setProfile stores and persists the profile', async () => {
  render(<UserProvider><Probe /></UserProvider>)
  await userEvent.click(screen.getByText('sin perfil'))
  expect(screen.getByText('Susana')).toBeInTheDocument()
  expect(JSON.parse(localStorage.getItem('simple.user')!).profile.nombre).toBe('Susana')
})

test('profile is rehydrated from localStorage on mount', () => {
  localStorage.setItem('simple.user', JSON.stringify({ profile: sample, identified: true }))
  render(<UserProvider><Probe /></UserProvider>)
  expect(screen.getByText('Susana')).toBeInTheDocument()
})

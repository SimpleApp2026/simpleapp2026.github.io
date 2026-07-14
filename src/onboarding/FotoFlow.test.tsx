import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { FotoPreguntar } from './FotoPreguntar'
import { FotoCargar } from './FotoCargar'
import { UserProvider } from '../state/UserProvider'
import { TtsProvider } from '../state/TtsProvider'
import { useUser } from '../state/hooks'
import type { Profile } from '../types'

const base: Profile = { nombre: 'S', apellido: 'M', barrio: '', fechaNacimiento: '', fotoDataUrl: null, intereses: [] }
function Seed() { const { setProfile } = useUser(); return <button onClick={() => setProfile(base)}>seed</button> }
function FotoShow() { const { profile } = useUser(); return <div>foto: {profile?.fotoDataUrl ?? 'ninguna'}</div> }

beforeEach(() => localStorage.clear())

test('“No” on the ask step goes to home', async () => {
  render(
    <UserProvider><TtsProvider><MemoryRouter initialEntries={['/registro/foto']}>
      <Routes>
        <Route path="/registro/foto" element={<FotoPreguntar />} />
        <Route path="/app/home" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter></TtsProvider></UserProvider>,
  )
  await userEvent.click(screen.getByRole('button', { name: /^No$/ }))
  expect(screen.getByText('Home')).toBeInTheDocument()
})

test('uploading a file stores a data URL on the profile', async () => {
  render(
    <UserProvider><TtsProvider><MemoryRouter initialEntries={['/seed']}>
      <Routes>
        <Route path="/seed" element={<><Seed /><FotoCargar /></>} />
        <Route path="/registro/foto/lista" element={<FotoShow />} />
      </Routes>
    </MemoryRouter></TtsProvider></UserProvider>,
  )
  await userEvent.click(screen.getByText('seed'))
  const file = new File(['hello'], 'foto.png', { type: 'image/png' })
  await userEvent.upload(screen.getByLabelText(/sumar tu foto/i), file)
  expect(await screen.findByText(/^foto: data:/)).toBeInTheDocument()
})

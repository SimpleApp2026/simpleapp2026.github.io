import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { UserProvider } from '../state/UserProvider'

beforeEach(() => localStorage.clear())

test('marks the active route', () => {
  render(
    <UserProvider>
      <MemoryRouter initialEntries={['/app/home']}><BottomNav /></MemoryRouter>
    </UserProvider>,
  )
  const inicio = screen.getByRole('link', { name: /inicio/i })
  expect(inicio).toHaveAttribute('aria-current', 'page')
})

test('shows the profile tab with a photo when the user has one', () => {
  localStorage.setItem('simple.user', JSON.stringify({
    profile: { nombre: 'Susana', apellido: 'M', barrio: '', fechaNacimiento: '', fotoDataUrl: null, intereses: [] },
    identified: true,
  }))
  render(
    <UserProvider>
      <MemoryRouter initialEntries={['/app/home']}><BottomNav /></MemoryRouter>
    </UserProvider>,
  )
  const perfil = screen.getByRole('link', { name: /perfil/i })
  expect(perfil.querySelector('img')).not.toBeNull()
})

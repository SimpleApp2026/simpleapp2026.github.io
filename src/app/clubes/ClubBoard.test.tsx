import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ClubBoard } from './ClubBoard'
import { TtsProvider } from '../../state/TtsProvider'

function setup(path: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/clubes/:id" element={<ClubBoard />} />
        <Route path="/app/clubes" element={<div>Clubes</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('shows club posts as bubbles and can publish a new one', async () => {
  setup('/app/clubes/lectura')
  expect(screen.getByRole('heading', { name: /Club de Lectura/i })).toBeInTheDocument()
  expect(screen.getByText(/Ayer volví a releer/)).toBeInTheDocument()
  // el composer se abre con el botón "+ COMENTAR EN EL CLUB"
  await userEvent.click(screen.getByRole('button', { name: /COMENTAR EN EL CLUB/i }))
  await userEvent.type(screen.getByLabelText(/Comentar en el club/i), 'Estoy leyendo poesía')
  await userEvent.click(screen.getByRole('button', { name: /Publicar/i }))
  expect(screen.getByText('Estoy leyendo poesía')).toBeInTheDocument()
})

test('each post has a reactions bar and toggling an emoji marks it selected', async () => {
  setup('/app/clubes/lectura')
  const corazones = screen.getAllByRole('button', { name: /Reaccionar con ❤️/i })
  expect(corazones.length).toBeGreaterThan(0)
  expect(corazones[0]).toHaveAttribute('aria-pressed', 'false')
  await userEvent.click(corazones[0])
  expect(corazones[0]).toHaveAttribute('aria-pressed', 'true')
  // pill de comentarios presente por publicación
  expect(screen.getAllByRole('button', { name: /^comentarios$/i }).length).toBeGreaterThan(0)
})

test('unknown club shows not found', () => {
  setup('/app/clubes/zzz')
  expect(screen.getByText(/no encontrado/i)).toBeInTheDocument()
})

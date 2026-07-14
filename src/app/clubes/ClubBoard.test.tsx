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

test('shows club posts and can publish a new one', async () => {
  setup('/app/clubes/lectura')
  expect(screen.getByRole('heading', { name: /Club de Lectura/i })).toBeInTheDocument()
  expect(screen.getByText(/Ayer volví a releer/)).toBeInTheDocument()
  await userEvent.type(screen.getByLabelText(/Comentar en el club/i), 'Estoy leyendo poesía')
  await userEvent.click(screen.getByRole('button', { name: /Publicar/i }))
  expect(screen.getByText('Estoy leyendo poesía')).toBeInTheDocument()
})

test('unknown club shows not found', () => {
  setup('/app/clubes/zzz')
  expect(screen.getByText(/no encontrado/i)).toBeInTheDocument()
})

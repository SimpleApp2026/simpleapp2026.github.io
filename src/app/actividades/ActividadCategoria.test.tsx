import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ActividadCategoria } from './ActividadCategoria'
import { TtsProvider } from '../../state/TtsProvider'

function setup(path: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/actividades/:cat" element={<ActividadCategoria />} />
        <Route path="/app/actividades/:cat/:id" element={<div>Detalle actividad</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('shows the category title, grouped activities, and navigates to detail', async () => {
  setup('/app/actividades/cine')
  expect(screen.getByRole('heading', { name: /Cine, teatro y museos/i })).toBeInTheDocument()
  expect(screen.getByText('Teatro')).toBeInTheDocument()
  expect(screen.getByText('Homenaje a Luis Brandoni')).toBeInTheDocument()
  await userEvent.click(screen.getByText('Homenaje a Luis Brandoni'))
  expect(screen.getByText('Detalle actividad')).toBeInTheDocument()
})

test('unknown category shows a not-found message', () => {
  setup('/app/actividades/zzz')
  expect(screen.getByText(/no encontrada/i)).toBeInTheDocument()
})

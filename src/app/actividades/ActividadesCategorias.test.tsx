import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ActividadesCategorias } from './ActividadesCategorias'
import { TtsProvider } from '../../state/TtsProvider'

function setup() {
  return render(
    <TtsProvider><MemoryRouter initialEntries={['/app/actividades']}>
      <Routes>
        <Route path="/app/actividades" element={<ActividadesCategorias />} />
        <Route path="/app/actividades/:cat" element={<div>Categoría cine</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('lists categories and navigates to one', async () => {
  setup()
  expect(screen.getByText('Cine, teatro y museos')).toBeInTheDocument()
  expect(screen.getByText('Vida Saludable')).toBeInTheDocument()
  await userEvent.click(screen.getByText('Cine, teatro y museos'))
  expect(screen.getByText('Categoría cine')).toBeInTheDocument()
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ActividadDetalle } from './ActividadDetalle'
import { ActividadConfirmacion } from './ActividadConfirmacion'
import { TtsProvider } from '../../state/TtsProvider'

function setup(path: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/actividades/:cat/:id" element={<ActividadDetalle />} />
        <Route path="/app/actividades/confirmada" element={<ActividadConfirmacion />} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('salud activity shows ¡Quiero ir! and reserving confirms with the title', async () => {
  setup('/app/actividades/salud/salud-stretching')
  expect(screen.getByText('Clases de stretching en Comuna 2')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /¡Quiero ir!/i }))
  expect(screen.getByText(/¡Felicitaciones!/i)).toBeInTheDocument()
  expect(screen.getByText(/Clases de stretching en Comuna 2/)).toBeInTheDocument()
})

test('non-salud activity shows Reservar', () => {
  setup('/app/actividades/cine/cine-brandoni')
  expect(screen.getByRole('button', { name: /^Reservar$/ })).toBeInTheDocument()
})

test('unknown activity shows not found', () => {
  setup('/app/actividades/cine/zzz')
  expect(screen.getByText(/no encontrada/i)).toBeInTheDocument()
})

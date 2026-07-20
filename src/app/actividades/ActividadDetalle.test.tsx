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

test('reserving confirms with the title, the reminder note and Ok', async () => {
  setup('/app/actividades/salud/salud-stretching')
  expect(screen.getByText('Clases de stretching en Comuna 2')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /¡Quiero ir!/i }))
  expect(screen.getByText(/¡FELICITACIONES!/i)).toBeInTheDocument()
  expect(screen.getByText(/Ya estás inscripto/i)).toBeInTheDocument()
  expect(screen.getByText(/Ese mismo día te recordaremos la actividad/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /^Ok$/ })).toBeInTheDocument()
})

test('every category uses the same ¡Quiero ir! call to action', () => {
  setup('/app/actividades/cine/cine-brandoni')
  expect(screen.getByRole('button', { name: /¡Quiero ir!/i })).toBeInTheDocument()
})

test('unknown activity shows not found', () => {
  setup('/app/actividades/cine/zzz')
  expect(screen.getByText(/no encontrada/i)).toBeInTheDocument()
})

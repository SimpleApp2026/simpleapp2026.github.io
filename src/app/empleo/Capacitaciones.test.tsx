import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Capacitaciones } from './Capacitaciones'
import { CapacitacionDetalle } from './CapacitacionDetalle'
import { CapacitacionConfirmada } from './CapacitacionConfirmada'
import { TtsProvider } from '../../state/TtsProvider'
import { CAPACITACIONES } from '../../data/empleo'

function setup(initial: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/app/empleo/capacitaciones" element={<Capacitaciones />} />
        <Route path="/app/empleo/capacitaciones/inscripto" element={<CapacitacionConfirmada />} />
        <Route path="/app/empleo/capacitaciones/:id" element={<CapacitacionDetalle />} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('lists all capacitaciones with a Conocer más button each', () => {
  setup('/app/empleo/capacitaciones')
  for (const c of CAPACITACIONES) expect(screen.getByText(c.titulo)).toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: /Conocer más/i })).toHaveLength(CAPACITACIONES.length)
})

test('full flow: conocer más → detail → inscribite → felicidades', async () => {
  setup('/app/empleo/capacitaciones')
  await userEvent.click(screen.getAllByRole('button', { name: /Conocer más/i })[2])
  expect(screen.getByText(CAPACITACIONES[2].descripcion)).toBeInTheDocument()
  expect(screen.getByText(new RegExp(CAPACITACIONES[2].lugar))).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /Inscribite/i }))
  expect(screen.getByText(/¡Felicidades!/i)).toBeInTheDocument()
  expect(screen.getByText(/Ya te inscribiste/)).toBeInTheDocument()
  expect(screen.getByText(new RegExp(CAPACITACIONES[2].titulo))).toBeInTheDocument()
})

test('unknown capacitación shows not found', () => {
  setup('/app/empleo/capacitaciones/zzz')
  expect(screen.getByText(/no encontrada/i)).toBeInTheDocument()
})

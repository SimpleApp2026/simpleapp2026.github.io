import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { DescuentosList } from './DescuentosList'
import { DescuentoDetalle } from './DescuentoDetalle'
import { DescuentoConfirmado } from './DescuentoConfirmado'
import { TtsProvider } from '../../state/TtsProvider'
import { DESCUENTOS } from '../../data/descuentos'

function wrap(initial: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/app/descuentos" element={<DescuentosList />} />
        <Route path="/app/descuentos/confirmado" element={<DescuentoConfirmado />} />
        <Route path="/app/descuentos/:id" element={<DescuentoDetalle />} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('lists discounts, opens one, and claims it', async () => {
  wrap('/app/descuentos')
  expect(screen.getByText(DESCUENTOS[0].comercio)).toBeInTheDocument()
  await userEvent.click(screen.getByText(DESCUENTOS[0].comercio))
  await userEvent.click(screen.getByRole('button', { name: /¡Lo quiero!/i }))
  expect(screen.getByText(/¡Listo!/i)).toBeInTheDocument()
  expect(screen.getByText(new RegExp(DESCUENTOS[0].comercio))).toBeInTheDocument()
})

test('unknown discount shows not found', () => {
  wrap('/app/descuentos/zzz')
  expect(screen.getByText(/no encontrado/i)).toBeInTheDocument()
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Oportunidades } from './Oportunidades'
import { Postular } from './Postular'
import { PostulacionConfirmada } from './PostulacionConfirmada'
import { TtsProvider } from '../../state/TtsProvider'

function wrap(initial: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/app/empleo/oportunidades" element={<Oportunidades />} />
        <Route path="/app/empleo/oportunidades/:id" element={<Postular />} />
        <Route path="/app/empleo/postulado" element={<PostulacionConfirmada />} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('lists jobs, opens one, and applies', async () => {
  wrap('/app/empleo/oportunidades')
  expect(screen.getByText(/Gerente de Operaciones/)).toBeInTheDocument()
  await userEvent.click(screen.getAllByRole('button', { name: /Conocer más/i })[2])
  expect(screen.getByRole('heading', { name: /Analista de Cuentas a Pagar/i })).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /Postular/i }))
  expect(screen.getByText(/¡Felicidades!/i)).toBeInTheDocument()
  expect(screen.getByText(/Ya te postulaste/i)).toBeInTheDocument()
})

test('unknown job id shows not found', () => {
  wrap('/app/empleo/oportunidades/zzz')
  expect(screen.getByText(/no encontrado/i)).toBeInTheDocument()
})

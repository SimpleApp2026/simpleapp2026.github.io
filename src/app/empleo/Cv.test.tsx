import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CvBuilder } from './CvBuilder'
import { CvPreliminar } from './CvPreliminar'
import { UserProvider } from '../../state/UserProvider'
import { TtsProvider } from '../../state/TtsProvider'

function setup() {
  return render(
    <UserProvider><TtsProvider><MemoryRouter initialEntries={['/app/empleo/experiencia']}>
      <Routes>
        <Route path="/app/empleo/experiencia" element={<CvBuilder />} />
        <Route path="/app/empleo/cv" element={<CvPreliminar />} />
        <Route path="/app/empleo" element={<div>Menú empleo</div>} />
      </Routes>
    </MemoryRouter></TtsProvider></UserProvider>,
  )
}

test('builder collects a name and shows it on the CV preview', async () => {
  setup()
  await userEvent.type(screen.getByLabelText('Nombre y apellido'), 'Carlos Gutierrez')
  await userEvent.click(screen.getByRole('button', { name: /Media jornada/i }))
  await userEvent.click(screen.getByRole('button', { name: /Ver curriculum/i }))
  expect(screen.getByText('Carlos Gutierrez')).toBeInTheDocument()
  expect(screen.getByText(/Profesora de Inglés/)).toBeInTheDocument()
  expect(screen.getByText('Educación')).toBeInTheDocument()
})

test('CV Guardar returns to the empleo menu', async () => {
  render(
    <UserProvider><TtsProvider><MemoryRouter initialEntries={['/app/empleo/cv']}>
      <Routes>
        <Route path="/app/empleo/cv" element={<CvPreliminar />} />
        <Route path="/app/empleo" element={<div>Menú empleo</div>} />
      </Routes>
    </MemoryRouter></TtsProvider></UserProvider>,
  )
  await userEvent.click(screen.getByRole('button', { name: /Guardar/i }))
  expect(screen.getByText('Menú empleo')).toBeInTheDocument()
})

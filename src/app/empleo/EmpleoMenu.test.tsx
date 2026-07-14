import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { EmpleoMenu } from './EmpleoMenu'
import { TtsProvider } from '../../state/TtsProvider'

function setup() {
  return render(
    <TtsProvider><MemoryRouter initialEntries={['/app/empleo']}>
      <Routes>
        <Route path="/app/empleo" element={<EmpleoMenu />} />
        <Route path="/app/empleo/oportunidades" element={<div>Oportunidades</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('lists the three empleo options and navigates', async () => {
  setup()
  expect(screen.getByText('Cargá tu experiencia')).toBeInTheDocument()
  expect(screen.getByText('Capacitaciones')).toBeInTheDocument()
  await userEvent.click(screen.getByText('Oportunidades laborales'))
  expect(screen.getByText('Oportunidades')).toBeInTheDocument()
})

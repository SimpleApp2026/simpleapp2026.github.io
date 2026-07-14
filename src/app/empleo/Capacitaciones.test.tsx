import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Capacitaciones } from './Capacitaciones'
import { TtsProvider } from '../../state/TtsProvider'
import { CAPACITACIONES } from '../../data/empleo'

test('lists all capacitaciones', () => {
  render(
    <TtsProvider><MemoryRouter initialEntries={['/app/empleo/capacitaciones']}>
      <Routes><Route path="/app/empleo/capacitaciones" element={<Capacitaciones />} /></Routes>
    </MemoryRouter></TtsProvider>,
  )
  for (const c of CAPACITACIONES) expect(screen.getByText(c.titulo)).toBeInTheDocument()
})

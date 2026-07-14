import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Amigos } from './Amigos'
import { CONVERSACIONES } from '../../data/foro'

test('lists all conversations', () => {
  render(
    <MemoryRouter initialEntries={['/app/foro/amigos']}>
      <Routes><Route path="/app/foro/amigos" element={<Amigos />} /></Routes>
    </MemoryRouter>,
  )
  expect(screen.getByText(/Conversaciones/i)).toBeInTheDocument()
  for (const c of CONVERSACIONES) expect(screen.getByText(c.amigo)).toBeInTheDocument()
})

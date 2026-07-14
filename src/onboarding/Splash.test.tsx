import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Splash } from './Splash'

test('splash shows welcome and Comenzar navigates to identificación', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/identificacion" element={<div>Pantalla identificación</div>} />
      </Routes>
    </MemoryRouter>,
  )
  expect(screen.getByText(/Bienvenido a/i)).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /Comenzar/i }))
  expect(screen.getByText('Pantalla identificación')).toBeInTheDocument()
})

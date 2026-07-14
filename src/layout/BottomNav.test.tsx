import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BottomNav } from './BottomNav'

test('marks the active route', () => {
  render(<MemoryRouter initialEntries={['/app/home']}><BottomNav /></MemoryRouter>)
  const inicio = screen.getByRole('link', { name: /inicio/i })
  expect(inicio).toHaveAttribute('aria-current', 'page')
})

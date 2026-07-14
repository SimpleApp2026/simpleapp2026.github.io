import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { AppProviders } from './App'

test('renders the home placeholder under /app/home with bottom nav', () => {
  render(
    <AppProviders>
      <MemoryRouter initialEntries={['/app/home']}><AppRoutes /></MemoryRouter>
    </AppProviders>,
  )
  expect(screen.getByRole('heading', { name: 'Inicio' })).toBeInTheDocument()
  expect(screen.getByText(/Próximamente/i)).toBeInTheDocument()
  expect(screen.getByRole('navigation')).toBeInTheDocument()
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Identificacion } from './Identificacion'
import { UserProvider } from '../state/UserProvider'
import { useUser } from '../state/hooks'

function IdentShow() {
  const { identified } = useUser()
  return <div>identified: {String(identified)}</div>
}

function setup(initial: string) {
  return render(
    <UserProvider>
      <MemoryRouter initialEntries={[initial]}>
        <Routes>
          <Route path="/identificacion" element={<Identificacion />} />
          <Route path="/registro/datos" element={<IdentShow />} />
          <Route path="/app/home" element={<IdentShow />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>,
  )
}

beforeEach(() => localStorage.clear())

test('“Deseo identificarme” sets identified and goes to registro', async () => {
  setup('/identificacion')
  await userEvent.click(screen.getByRole('button', { name: /Deseo identificarme/i }))
  expect(screen.getByText('identified: true')).toBeInTheDocument()
})

test('“Sin identificarme” goes to home as anonymous', async () => {
  setup('/identificacion')
  await userEvent.click(screen.getByRole('button', { name: /Sin identificarme/i }))
  expect(screen.getByText('identified: false')).toBeInTheDocument()
})

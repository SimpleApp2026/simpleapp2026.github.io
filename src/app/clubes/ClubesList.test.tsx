import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ClubesList } from './ClubesList'
import { TtsProvider } from '../../state/TtsProvider'

function setup() {
  return render(
    <TtsProvider><MemoryRouter initialEntries={['/app/clubes']}>
      <Routes>
        <Route path="/app/clubes" element={<ClubesList />} />
        <Route path="/app/clubes/:id" element={<div>Club board</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('lists clubs and opens one', async () => {
  setup()
  expect(screen.getByText('Club de Lectura')).toBeInTheDocument()
  expect(screen.getByText('Club de mascotas')).toBeInTheDocument()
  await userEvent.click(screen.getByText('Club de Lectura'))
  expect(screen.getByText('Club board')).toBeInTheDocument()
})

import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { LegalDoc } from './LegalDoc'
import { TtsProvider } from '../../state/TtsProvider'

function setup(path: string) {
  return render(
    <TtsProvider><MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/app/legal/:doc" element={<LegalDoc />} />
        <Route path="/app/config" element={<div>Config</div>} />
      </Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('renders the Objetivo doc', () => {
  setup('/app/legal/objetivo')
  expect(screen.getByRole('heading', { name: /Objetivo de \+Simple/i })).toBeInTheDocument()
  expect(screen.getByText(/Creamos \+Simple/)).toBeInTheDocument()
})

test('unknown doc shows not found', () => {
  setup('/app/legal/zzz')
  expect(screen.getByText(/no encontrado/i)).toBeInTheDocument()
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Ayuda } from './Ayuda'
import { TtsProvider } from '../../state/TtsProvider'
import { FAQ } from '../../data/faq'

function setup() {
  return render(
    <TtsProvider><MemoryRouter initialEntries={['/app/ayuda']}>
      <Routes><Route path="/app/ayuda" element={<Ayuda />} /></Routes>
    </MemoryRouter></TtsProvider>,
  )
}

test('shows questions and expands an answer on click', async () => {
  setup()
  const first = FAQ[0]
  const btn = screen.getByRole('button', { name: new RegExp(first.pregunta.slice(0, 15), 'i') })
  expect(btn).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByText(first.respuesta)).not.toBeInTheDocument()
  await userEvent.click(btn)
  expect(btn).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByText(first.respuesta)).toBeInTheDocument()
})

test('shows the contact footer', () => {
  setup()
  expect(screen.getByText(/147/)).toBeInTheDocument()
})

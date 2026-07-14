import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toggle } from './Toggle'

test('Toggle reflects checked state and fires onChange', async () => {
  const onChange = vi.fn()
  render(<Toggle checked={false} onChange={onChange} label="Textos grandes" />)
  const sw = screen.getByRole('switch', { name: 'Textos grandes' })
  expect(sw).toHaveAttribute('aria-checked', 'false')
  await userEvent.click(sw)
  expect(onChange).toHaveBeenCalled()
})

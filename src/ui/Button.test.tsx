import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

test('Button renders label and fires onClick', async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Continuar</Button>)
  await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
  expect(onClick).toHaveBeenCalled()
})

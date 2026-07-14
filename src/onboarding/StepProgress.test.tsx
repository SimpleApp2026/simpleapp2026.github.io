import { render, screen } from '@testing-library/react'
import { StepProgress } from './StepProgress'

test('renders the right number of segments and fills up to step', () => {
  render(<StepProgress step={2} total={3} />)
  const bar = screen.getByTestId('step-progress')
  expect(bar).toHaveAttribute('aria-label', 'Paso 2 de 3')
  expect(bar.children).toHaveLength(3)
})

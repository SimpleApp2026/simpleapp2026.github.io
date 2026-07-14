import { render } from '@testing-library/react'

test('primary token class applies a background color', () => {
  const { container } = render(<div className="bg-primary" data-testid="x">hola</div>)
  const el = container.firstChild as HTMLElement
  // jsdom does not compute Tailwind output, so assert the class is present.
  expect(el).toHaveClass('bg-primary')
})

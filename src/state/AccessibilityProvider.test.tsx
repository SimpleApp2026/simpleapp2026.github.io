import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccessibilityProvider } from './AccessibilityProvider'
import { useAccessibility } from './hooks'

function Probe() {
  const { largeText, toggleLargeText } = useAccessibility()
  return <button onClick={toggleLargeText}>{largeText ? 'grande' : 'normal'}</button>
}

beforeEach(() => { localStorage.clear(); document.documentElement.className = '' })

test('toggling large text adds the root class and persists', async () => {
  render(<AccessibilityProvider><Probe /></AccessibilityProvider>)
  expect(screen.getByText('normal')).toBeInTheDocument()
  await userEvent.click(screen.getByText('normal'))
  expect(screen.getByText('grande')).toBeInTheDocument()
  expect(document.documentElement).toHaveClass('a11y-large')
  expect(JSON.parse(localStorage.getItem('simple.a11y')!).largeText).toBe(true)
})

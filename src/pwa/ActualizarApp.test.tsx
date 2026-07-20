import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActualizarApp } from './ActualizarApp'

test('muestra el aviso grande y actualiza al tocar el botón', async () => {
  const actualizar = vi.fn()
  render(<ActualizarApp onActualizar={actualizar} />)

  expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  expect(screen.getByRole('heading', { name: /Hay una versión nueva/i })).toBeInTheDocument()
  expect(screen.getByText(/podés seguir usando la app sin internet/i)).toBeInTheDocument()

  const boton = screen.getByRole('button', { name: /Actualizar ahora/i })
  await userEvent.click(boton)
  expect(actualizar).toHaveBeenCalledTimes(1)
  // mientras aplica la actualización el botón queda deshabilitado
  expect(screen.getByRole('button', { name: /Actualizando/i })).toBeDisabled()
})

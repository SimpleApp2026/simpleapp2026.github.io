import { DESCUENTOS, getDescuento } from './descuentos'

test('has discounts with unique ids and a lookup', () => {
  expect(DESCUENTOS.length).toBeGreaterThan(0)
  expect(new Set(DESCUENTOS.map((d) => d.id)).size).toBe(DESCUENTOS.length)
  expect(getDescuento(DESCUENTOS[0].id)?.id).toBe(DESCUENTOS[0].id)
  expect(getDescuento('nope')).toBeUndefined()
})

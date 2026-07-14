import { CARTAS_PUBLICAS, CARTAS_PRIVADAS, CONVERSACIONES, getCartaPublica, getCartaPrivada } from './foro'

test('fixtures have content and unique ids', () => {
  expect(CARTAS_PUBLICAS.length).toBeGreaterThan(0)
  expect(CARTAS_PRIVADAS.length).toBeGreaterThan(0)
  expect(CONVERSACIONES.length).toBeGreaterThan(0)
  expect(new Set(CARTAS_PUBLICAS.map((c) => c.id)).size).toBe(CARTAS_PUBLICAS.length)
})

test('getters look up by id', () => {
  const p = CARTAS_PUBLICAS[0]
  expect(getCartaPublica(p.id)?.id).toBe(p.id)
  expect(getCartaPublica('nope')).toBeUndefined()
  expect(getCartaPrivada(CARTAS_PRIVADAS[0].id)?.id).toBe(CARTAS_PRIVADAS[0].id)
})

test('public letters carry comments', () => {
  expect(CARTAS_PUBLICAS.some((c) => c.comentarios.length > 0)).toBe(true)
})

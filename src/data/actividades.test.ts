import { CATEGORIAS, ACTIVIDADES, actividadesDeCategoria, getActividad, getCategoria } from './actividades'

test('has four categories with unique keys', () => {
  expect(CATEGORIAS).toHaveLength(4)
  expect(new Set(CATEGORIAS.map((c) => c.key)).size).toBe(4)
})

test('every activity references a real category', () => {
  const keys = new Set(CATEGORIAS.map((c) => c.key))
  for (const a of ACTIVIDADES) expect(keys.has(a.categoria)).toBe(true)
})

test('helpers filter and look up', () => {
  const salud = actividadesDeCategoria('salud')
  expect(salud.length).toBeGreaterThan(0)
  expect(salud.every((a) => a.categoria === 'salud')).toBe(true)
  expect(getActividad(salud[0].id)?.id).toBe(salud[0].id)
  expect(getCategoria('cine')?.titulo).toMatch(/Cine/)
  expect(getActividad('no-existe')).toBeUndefined()
})

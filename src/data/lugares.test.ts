import { LUGARES } from './lugares'
import { getActividad } from './actividades'
import { getCapacitacion } from './empleo'

test('lugares have unique ids and CABA-range coordinates', () => {
  expect(LUGARES.length).toBeGreaterThanOrEqual(15)
  expect(new Set(LUGARES.map((l) => l.id)).size).toBe(LUGARES.length)
  for (const l of LUGARES) {
    expect(l.lat, l.id).toBeGreaterThan(-34.72)
    expect(l.lat, l.id).toBeLessThan(-34.52)
    expect(l.lng, l.id).toBeGreaterThan(-58.54)
    expect(l.lng, l.id).toBeLessThan(-58.33)
    expect(l.link, l.id).toMatch(/^\/app\//)
  }
})

test('links to actividades and capacitaciones point to real fixtures', () => {
  for (const l of LUGARES) {
    const act = l.link.match(/^\/app\/actividades\/[^/]+\/(.+)$/)
    if (act) expect(getActividad(act[1]), l.id).toBeDefined()
    const cap = l.link.match(/^\/app\/empleo\/capacitaciones\/(.+)$/)
    if (cap) expect(getCapacitacion(cap[1]), l.id).toBeDefined()
  }
})

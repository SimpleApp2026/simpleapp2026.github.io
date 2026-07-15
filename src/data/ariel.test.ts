import { arielRespond, greeting, QUICK_REPLIES } from './ariel'

test('greeting includes the name when given, omits gracefully when not', () => {
  expect(greeting('Susana')).toMatch(/Hola Susana/)
  expect(greeting()).toMatch(/Hola/)
  expect(greeting()).not.toMatch(/undefined/)
})

test('arielRespond matches health, activities, and news keywords', () => {
  expect(arielRespond('Tengo que hacerme una endoscopía, ¿qué centros hay cerca?')).toMatch(/Centros TCBA|centro/i)
  expect(arielRespond('¿Qué actividades hay esta semana?')).toMatch(/actividad|Yoga|Taller/i)
  expect(arielRespond('Quiero las noticias de hoy')).toMatch(/noticias/i)
})

test('arielRespond has a helpful default', () => {
  const r = arielRespond('asdfghjkl')
  expect(r.length).toBeGreaterThan(0)
  expect(r).toMatch(/ayudar|turnos|actividades|noticias/i)
})

test('quick replies are non-empty', () => {
  expect(QUICK_REPLIES.length).toBeGreaterThan(0)
})

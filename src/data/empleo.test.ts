import { JOBS, CAPACITACIONES, getJob } from './empleo'

test('has jobs with unique ids and a lookup', () => {
  expect(JOBS.length).toBeGreaterThanOrEqual(3)
  expect(new Set(JOBS.map((j) => j.id)).size).toBe(JOBS.length)
  expect(getJob(JOBS[0].id)?.id).toBe(JOBS[0].id)
  expect(getJob('no-existe')).toBeUndefined()
})

test('has capacitaciones', () => {
  expect(CAPACITACIONES.length).toBeGreaterThanOrEqual(3)
})

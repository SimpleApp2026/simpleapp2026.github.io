import { CLUBES, getClub } from './clubes'

test('has seven clubs with unique ids and posts', () => {
  // 5 clubs de los frames del Figma + chisme y música (estampillas de "Clubes iconos")
  expect(CLUBES).toHaveLength(7)
  expect(new Set(CLUBES.map((c) => c.id)).size).toBe(7)
  expect(CLUBES.every((c) => c.posts.length > 0)).toBe(true)
})

test('getClub looks up by id', () => {
  expect(getClub(CLUBES[0].id)?.id).toBe(CLUBES[0].id)
  expect(getClub('nope')).toBeUndefined()
})

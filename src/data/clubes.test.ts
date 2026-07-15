import { CLUBES, getClub } from './clubes'

test('has five clubs with unique ids and posts', () => {
  expect(CLUBES).toHaveLength(5)
  expect(new Set(CLUBES.map((c) => c.id)).size).toBe(5)
  expect(CLUBES.every((c) => c.posts.length > 0)).toBe(true)
})

test('getClub looks up by id', () => {
  expect(getClub(CLUBES[0].id)?.id).toBe(CLUBES[0].id)
  expect(getClub('nope')).toBeUndefined()
})

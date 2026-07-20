import { CLUBES, getClub } from './clubes'
import { avatarDe } from './avatars'

test('has the eight Figma clubs with unique ids and posts', () => {
  // clubes de los frames 60 del Figma (lectura, chisme, música, viajes,
  // manualidades, cocina, bienestar y mascotas)
  expect(CLUBES).toHaveLength(8)
  expect(new Set(CLUBES.map((c) => c.id)).size).toBe(8)
  expect(CLUBES.map((c) => c.id)).toContain('viajes')
  // al menos 3 mensajes por club, como los boards del Figma
  expect(CLUBES.every((c) => c.posts.length >= 3)).toBe(true)
})

test('every club post author has a real avatar photo', () => {
  for (const club of CLUBES) {
    for (const post of club.posts) {
      expect(avatarDe(post.autor), `${club.id}/${post.autor}`).toBeTruthy()
    }
  }
})

test('getClub looks up by id', () => {
  expect(getClub(CLUBES[0].id)?.id).toBe(CLUBES[0].id)
  expect(getClub('nope')).toBeUndefined()
})

import { CLUBES, getClub } from './clubes'
import { avatarDe } from './avatars'

test('has seven clubs with unique ids and posts', () => {
  // 5 clubs de los frames del Figma + chisme y música (estampillas de "Clubes iconos")
  expect(CLUBES).toHaveLength(7)
  expect(new Set(CLUBES.map((c) => c.id)).size).toBe(7)
  // 3 mensajes por club, como los boards del Figma (frame 60)
  expect(CLUBES.every((c) => c.posts.length === 3)).toBe(true)
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

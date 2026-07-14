import { ageFromIso, formatLongDate } from './age'

test('ageFromIso computes whole years', () => {
  // use the local Date(y, mIndex, d) constructor to avoid UTC-parsing TZ drift
  expect(ageFromIso('1956-10-17', new Date(2026, 4, 21))).toBe(69)  // before birthday
  expect(ageFromIso('1956-10-17', new Date(2026, 9, 17))).toBe(70)  // on birthday
  expect(ageFromIso('', new Date(2026, 4, 21))).toBeNull()
  expect(ageFromIso('not-a-date')).toBeNull()
})

test('formatLongDate renders a Spanish long date', () => {
  expect(formatLongDate('1956-10-17')).toMatch(/17 de octubre de 1956/)
  expect(formatLongDate('')).toBe('')
})

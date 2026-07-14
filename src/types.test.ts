import type { Profile, Interest } from './types'

test('Profile shape is usable', () => {
  const interests: Interest[] = ['Gastronomía', 'Jardinería']
  const p: Profile = {
    nombre: 'Susana', apellido: 'Martinez', barrio: 'Recoleta',
    fechaNacimiento: '1956-10-17', fotoDataUrl: null, intereses: interests,
  }
  expect(p.nombre).toBe('Susana')
  expect(p.intereses).toContain('Jardinería')
})

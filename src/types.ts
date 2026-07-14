export type Interest =
  | 'Gastronomía' | 'Idiomas' | 'Jardinería' | 'Manualidades'
  | 'Truco' | 'Cocinar' | 'Películas'

export interface Profile {
  nombre: string
  apellido: string
  barrio: string
  /** ISO date yyyy-mm-dd */
  fechaNacimiento: string
  /** data: URL of uploaded photo, or null */
  fotoDataUrl: string | null
  intereses: Interest[]
}

export interface CvData {
  telefono: string
  email: string
  disponibilidad: 'Media jornada' | 'Jornada completa' | null
}

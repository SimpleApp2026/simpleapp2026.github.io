export type CategoriaKey = 'cine' | 'ferias' | 'paseos' | 'salud'
export interface Categoria { key: CategoriaKey; titulo: string; emoji: string }
export interface Actividad {
  id: string
  categoria: CategoriaKey
  grupo: string
  titulo: string
  lugar: string
  fecha: string
  descripcion?: string
}

export const CATEGORIAS: Categoria[] = [
  { key: 'cine', titulo: 'Cine, teatro y museos', emoji: '🎭' },
  { key: 'ferias', titulo: 'Ferias y gastronomía', emoji: '🍷' },
  { key: 'paseos', titulo: 'Paseos y salidas', emoji: '🚶' },
  { key: 'salud', titulo: 'Vida Saludable', emoji: '🧘' },
]

export const ACTIVIDADES: Actividad[] = [
  // Cine, teatro y museos
  { id: 'cine-teatro-falla', categoria: 'cine', grupo: 'Teatro', titulo: 'Concierto conservatorio: Manuel de Falla', lugar: 'Gallo 200, Sarmiento (Abasto)', fecha: 'Viernes 22 de Mayo, 19:00h' },
  { id: 'cine-brandoni', categoria: 'cine', grupo: 'Cine', titulo: 'Homenaje a Luis Brandoni', lugar: 'Palacio Libertad (Ex CCK)', fecha: 'Viernes 30 de mayo, 15:30h', descripcion: 'Un recorrido por sus interpretaciones más icónicas.' },
  { id: 'cine-museo-inmigracion', categoria: 'cine', grupo: 'Museo', titulo: 'Visita guiada: Museo de la inmigración', lugar: 'Museo de la inmigración', fecha: 'Miércoles a domingos, 11 a 18hs' },
  // Ferias y gastronomía
  { id: 'ferias-sabe-la-tierra', categoria: 'ferias', grupo: 'Feria', titulo: 'Sabe la tierra — BA Capital Gastronómica', lugar: 'Parque 3 de Febrero', fecha: 'Gratis todos los domingos' },
  { id: 'ferias-cocina-abierta', categoria: 'ferias', grupo: 'Feria', titulo: 'Cocina Abierta: Viva la patria', lugar: 'Palacio Libertad (Ex CCK)', fecha: 'Sábado 24 de mayo, 14 a 20hs' },
  { id: 'ferias-hora-del-te', categoria: 'ferias', grupo: 'Gastronomía', titulo: 'Hora del té y merienda libre', lugar: 'Palacio Paz', fecha: 'Martes 16 de junio, 16 a 18hs' },
  // Paseos y salidas
  { id: 'paseos-edificios', categoria: 'paseos', grupo: 'Experiencias culturales', titulo: 'Recorrido por edificios emblemáticos', lugar: 'Plaza de Mayo', fecha: 'Viernes 30 de Mayo, 17:00h', descripcion: 'Conocé la historia detrás de los edificios más emblemáticos de CABA.' },
  { id: 'paseos-el-plata', categoria: 'paseos', grupo: 'Experiencias culturales', titulo: 'Paseo por el teatro El Plata + clase de milonga', lugar: 'Teatro El Plata', fecha: 'Jueves 29 de mayo, 15:30h' },
  { id: 'paseos-la-boca', categoria: 'paseos', grupo: 'Experiencias culturales', titulo: 'Visita guiada por el barrio de inmigrantes', lugar: 'Barrio La Boca', fecha: 'Miércoles a domingos, 11 a 18hs' },
  // Vida Saludable
  { id: 'salud-bici', categoria: 'salud', grupo: 'Aire Libre', titulo: 'Soltáte: aprendé a andar en Bici', lugar: 'Plaza Clemente', fecha: 'Sábado 6 de Junio, 13hs' },
  { id: 'salud-plazas-activas', categoria: 'salud', grupo: 'Plazas Amigables', titulo: 'Plazas Activas: ¡Comuna 8 vení a hacer ejercicio!', lugar: 'Plaza Sudamérica', fecha: 'Martes y jueves, 11hs' },
  { id: 'salud-stretching', categoria: 'salud', grupo: 'Plazas Amigables', titulo: 'Clases de stretching en Comuna 2', lugar: 'Plaza Francia', fecha: 'Miércoles, 10hs', descripcion: '¡Disfrutá del estiramiento! Todos los Miércoles a las 10hs. Profesora Laura P.' },
]

export function actividadesDeCategoria(cat: CategoriaKey): Actividad[] {
  return ACTIVIDADES.filter((a) => a.categoria === cat)
}
export function getActividad(id: string): Actividad | undefined {
  return ACTIVIDADES.find((a) => a.id === id)
}
export function getCategoria(key: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.key === key)
}

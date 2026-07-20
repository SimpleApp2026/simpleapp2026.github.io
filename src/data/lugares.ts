import type { CategoriaKey } from './actividades'

// Marcadores del Mapa (frames 67-68 del Figma): todas las direcciones que se
// mencionan a lo largo de la app (actividades, capacitaciones, agenda del
// Home y el Teatro Colón del Club de música), con coordenadas aproximadas
// de la Ciudad de Buenos Aires.
export interface Lugar {
  id: string
  nombre: string
  evento: string
  fecha: string
  /** categoría para la estampilla del popup ('capacitacion' usa 🎓) */
  cat: CategoriaKey | 'capacitacion' | 'musica'
  lat: number
  lng: number
  /** ruta interna a la que lleva el botón "Quiero ir" */
  link: string
}

export const LUGARES: Lugar[] = [
  // Agenda del Home (y popup del frame 68 del Figma)
  { id: 'yoga-vicente-lopez', nombre: 'Plaza Vicente Lopez y Planes', evento: 'Yoga al aire libre', fecha: 'Jueves 21 de mayo a las 15 hs', cat: 'salud', lat: -34.5916, lng: -58.3925, link: '/app/actividades/salud' },
  { id: 'taller-ruben-dario', nombre: 'Plaza Rubén Darío', evento: 'Taller de escritura', fecha: 'Miércoles 21 de mayo, 16:30 – 17:30', cat: 'paseos', lat: -34.5849, lng: -58.3903, link: '/app/actividades' },
  // Actividades
  { id: 'cine-teatro-falla', nombre: 'Gallo 200, Sarmiento (Abasto)', evento: 'Concierto conservatorio: Manuel de Falla', fecha: 'Viernes 22 de Mayo, 19:00h', cat: 'cine', lat: -34.6046, lng: -58.4109, link: '/app/actividades/cine/cine-teatro-falla' },
  { id: 'cine-brandoni', nombre: 'Palacio Libertad (Ex CCK)', evento: 'Homenaje a Luis Brandoni', fecha: 'Viernes 30 de mayo, 15:30h', cat: 'cine', lat: -34.6036, lng: -58.3690, link: '/app/actividades/cine/cine-brandoni' },
  { id: 'cine-museo-inmigracion', nombre: 'Museo de la inmigración', evento: 'Visita guiada', fecha: 'Miércoles a domingos, 11 a 18hs', cat: 'cine', lat: -34.5893, lng: -58.3668, link: '/app/actividades/cine/cine-museo-inmigracion' },
  { id: 'ferias-sabe-la-tierra', nombre: 'Parque 3 de Febrero', evento: 'Sabe la tierra — BA Capital Gastronómica', fecha: 'Gratis todos los domingos', cat: 'ferias', lat: -34.5711, lng: -58.4167, link: '/app/actividades/ferias/ferias-sabe-la-tierra' },
  { id: 'ferias-cocina-abierta', nombre: 'Palacio Libertad (Ex CCK)', evento: 'Cocina Abierta: Viva la patria', fecha: 'Sábado 24 de mayo, 14 a 20hs', cat: 'ferias', lat: -34.6027, lng: -58.3701, link: '/app/actividades/ferias/ferias-cocina-abierta' },
  { id: 'ferias-hora-del-te', nombre: 'Palacio Paz', evento: 'Hora del té y merienda libre', fecha: 'Martes 16 de junio, 16 a 18hs', cat: 'ferias', lat: -34.5957, lng: -58.3762, link: '/app/actividades/ferias/ferias-hora-del-te' },
  { id: 'paseos-edificios', nombre: 'Plaza de Mayo', evento: 'Recorrido por edificios emblemáticos', fecha: 'Viernes 30 de Mayo, 17:00h', cat: 'paseos', lat: -34.6083, lng: -58.3722, link: '/app/actividades/paseos/paseos-edificios' },
  { id: 'paseos-el-plata', nombre: 'Teatro El Plata', evento: 'Paseo + clase de milonga', fecha: 'Jueves 29 de mayo, 15:30h', cat: 'paseos', lat: -34.6553, lng: -58.5035, link: '/app/actividades/paseos/paseos-el-plata' },
  { id: 'paseos-la-boca', nombre: 'Barrio La Boca', evento: 'Visita guiada por el barrio de inmigrantes', fecha: 'Miércoles a domingos, 11 a 18hs', cat: 'paseos', lat: -34.6345, lng: -58.3631, link: '/app/actividades/paseos/paseos-la-boca' },
  { id: 'salud-bici', nombre: 'Plaza Clemente', evento: 'Soltáte: aprendé a andar en Bici', fecha: 'Sábado 6 de Junio, 13hs', cat: 'salud', lat: -34.5766, lng: -58.4441, link: '/app/actividades/salud/salud-bici' },
  { id: 'salud-plazas-activas', nombre: 'Plaza Sudamérica', evento: 'Plazas Activas: ¡Comuna 8!', fecha: 'Martes y jueves, 11hs', cat: 'salud', lat: -34.6752, lng: -58.4590, link: '/app/actividades/salud/salud-plazas-activas' },
  { id: 'salud-stretching', nombre: 'Plaza Francia', evento: 'Clases de stretching en Comuna 2', fecha: 'Miércoles, 10hs', cat: 'salud', lat: -34.5838, lng: -58.3936, link: '/app/actividades/salud/salud-stretching' },
  // Capacitaciones
  { id: 'cap-ia', nombre: 'Biblioteca del barrio, Av. Corrientes 1420', evento: 'IA para todos: Aprendé paso a paso', fecha: 'Martes 9 de junio, 15:00h', cat: 'capacitacion', lat: -34.6039, lng: -58.3874, link: '/app/empleo/capacitaciones/ia-para-todos' },
  { id: 'cap-tecnologia', nombre: 'Club Argentino, Talcahuano 955', evento: 'Aprendé tecnología en el Club Argentino', fecha: 'Jueves 11 de junio, 10:00h', cat: 'capacitacion', lat: -34.5993, lng: -58.3849, link: '/app/empleo/capacitaciones/tecnologia-club' },
  { id: 'cap-auxilios', nombre: 'Luna 47, Parque Patricios', evento: 'Capacitate en primeros auxilios', fecha: 'Viernes 12 de junio, 14:00h', cat: 'capacitacion', lat: -34.6366, lng: -58.4008, link: '/app/empleo/capacitaciones/primeros-auxilios' },
  // Club de música
  { id: 'teatro-colon', nombre: 'Teatro Colón', evento: 'Réquiem de Mozart (Club de música)', fecha: 'Sábado a la noche', cat: 'musica', lat: -34.6011, lng: -58.3826, link: '/app/clubes/musica' },
]

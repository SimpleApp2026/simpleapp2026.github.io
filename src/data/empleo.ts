export interface Job { id: string; puesto: string; rubro: string; descripcion: string }
export interface Capacitacion { id: string; titulo: string; detalle: string; descripcion: string; lugar: string; fecha: string }

export const JOBS: Job[] = [
  { id: 'gerente-operaciones', puesto: 'Gerente de Operaciones', rubro: 'Mantenimiento Edificio/Corporativo', descripcion: 'Buscamos una persona con experiencia en la coordinación de equipos de mantenimiento y servicios generales para edificios corporativos. Se valora la organización, el trato cordial y la responsabilidad.' },
  { id: 'secretaria-bilingue', puesto: 'Secretaria Ejecutiva Bilingüe', rubro: 'Energía/Administrativo', descripcion: 'Importante empresa del sector energético incorpora una secretaria ejecutiva con dominio de inglés para tareas administrativas, agenda y atención de reuniones. Se ofrece un ambiente de trabajo respetuoso y flexible.' },
  { id: 'analista-cuentas', puesto: 'Analista de Cuentas a Pagar', rubro: 'Contable/Administrativo', descripcion: 'Importante grupo de empresas con más de 60 años de trayectoria en los sectores de construcción, minería, arquitectura y agroindustria se encuentra en la búsqueda de un/a Analista de Cuentas a Pagar. El principal desafío de esta posición es gestionar de manera integral el ciclo de cuentas por pagar y velar por el cumplimiento de las normativas fiscales vigentes. Quien ocupe el rol actuará como nexo analítico entre las áreas.' },
]

// Textos de los frames 37-38 del Figma (IA para todos / tecnología / primeros auxilios)
export const CAPACITACIONES: Capacitacion[] = [
  {
    id: 'ia-para-todos',
    titulo: 'IA para todos: Aprendé paso a paso',
    detalle: '¡Aprendé a usar la IA simple y rápido!',
    descripcion: 'Un taller pensado para descubrir qué es la inteligencia artificial y cómo puede ayudarte en el día a día: hacer preguntas, pedir recomendaciones y resolver dudas, todo con ejemplos simples y a tu ritmo.',
    lugar: 'Biblioteca del barrio, Av. Corrientes 1420',
    fecha: 'Martes 9 de junio, 15:00h',
  },
  {
    id: 'tecnologia-club',
    titulo: 'Aprendé tecnología con Club Argentec',
    detalle: 'Comenzá tu formación en tecnología.',
    descripcion: 'Encuentros semanales para aprender a usar el celular y la computadora con confianza: mensajes, fotos, videollamadas y trámites online, acompañado por docentes con mucha paciencia.',
    lugar: 'Club Argentec, Talcahuano 955',
    fecha: 'Jueves 11 de junio, 10:00h',
  },
  {
    id: 'primeros-auxilios',
    titulo: 'Capacitate en primeros auxilios',
    detalle: 'Una charla para estar preparados en el momento justo.',
    descripcion: 'Una charla pensada para aprender a identificar cuáles son las principales emergencias y cómo actuar en cada caso: golpes, caídas y maniobras básicas de auxilio, con práctica guiada.',
    lugar: 'Luna 47, Parque Patricios',
    fecha: 'Viernes 12 de junio, 14:00h',
  },
]

export function getJob(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id)
}

export function getCapacitacion(id: string): Capacitacion | undefined {
  return CAPACITACIONES.find((c) => c.id === id)
}

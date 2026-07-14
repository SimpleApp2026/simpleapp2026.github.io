export interface Job { id: string; puesto: string; rubro: string; descripcion: string }
export interface Capacitacion { id: string; titulo: string; detalle: string }

export const JOBS: Job[] = [
  { id: 'gerente-operaciones', puesto: 'Gerente de Operaciones', rubro: 'Mantenimiento Edificio/Corporativo', descripcion: 'Buscamos una persona con experiencia en la coordinación de equipos de mantenimiento y servicios generales para edificios corporativos. Se valora la organización, el trato cordial y la responsabilidad.' },
  { id: 'secretaria-bilingue', puesto: 'Secretaria Ejecutiva Bilingüe', rubro: 'Energía/Administrativo', descripcion: 'Importante empresa del sector energético incorpora una secretaria ejecutiva con dominio de inglés para tareas administrativas, agenda y atención de reuniones. Se ofrece un ambiente de trabajo respetuoso y flexible.' },
  { id: 'analista-cuentas', puesto: 'Analista de Cuentas a Pagar', rubro: 'Contable/Administrativo', descripcion: 'Importante grupo de empresas con más de 60 años de trayectoria en los sectores de construcción, minería, arquitectura y agroindustria se encuentra en la búsqueda de un/a Analista de Cuentas a Pagar. El principal desafío de esta posición es gestionar de manera integral el ciclo de cuentas por pagar y velar por el cumplimiento de las normativas fiscales vigentes. Quien ocupe el rol actuará como nexo analítico entre las áreas.' },
]

export const CAPACITACIONES: Capacitacion[] = [
  { id: 'computacion', titulo: 'Introducción a la computación', detalle: 'Aprendé a usar la computadora desde cero, a tu ritmo.' },
  { id: 'celular', titulo: 'Usá tu celular con confianza', detalle: 'Mensajes, fotos, videollamadas y apps útiles del día a día.' },
  { id: 'tramites-digitales', titulo: 'Trámites digitales', detalle: 'Turnos, gestiones y trámites online de forma simple y segura.' },
]

export function getJob(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id)
}

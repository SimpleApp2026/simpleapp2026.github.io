export interface AgendaItem { id: string; titulo: string; horario: string }

export const AGENDA_FECHA = 'Miércoles 21 de mayo 2026'

export const AGENDA: AgendaItem[] = [
  { id: 'yoga', titulo: 'Yoga en plaza Vicente López', horario: '13:00 – 15:00' },
  { id: 'taller', titulo: 'Taller de escritura en plaza Rubén Darío', horario: '16:30 – 17:30' },
]

export type ChatFrom = 'ariel' | 'user'
export interface ChatMsg { id: string; from: ChatFrom; texto: string }

export function greeting(nombre?: string): string {
  const n = nombre?.trim()
  return n
    ? `¡Hola ${n}! Me alegra tenerte acá, contame ¿qué necesitás?`
    : '¡Hola! Me alegra tenerte acá, contame ¿qué necesitás?'
}

export const QUICK_REPLIES = ['Turnos médicos', 'Actividades de la semana', 'Noticias de hoy']

export function arielRespond(text: string): string {
  const t = text.toLowerCase()
  if (/endoscop|centro|m[eé]dic|turno|salud|estudio/.test(t))
    return 'El centro más cercano a tu zona es Centros TCBA Recoleta. ¿Querés que te contacte con ellos?'
  if (/^s[ií]\b|s[ií],? por favor|dale|contact/.test(t))
    return 'Llamando a Centros TCBA... No salgas del chat, te comunico enseguida.'
  if (/actividad|evento|hacer esta semana|salida/.test(t))
    return 'Esta semana podés participar de: Yoga en plaza Vicente López, Taller de escritura en plaza Rubén Darío y una visita guiada por el barrio de La Boca.'
  if (/noticia|diario|novedad/.test(t))
    return 'Estas son las noticias más importantes de hoy: 1) Mirtha Legrand celebró el 25 de Mayo con un festejo especial. 2) Se debate una nueva ley para facilitar la compra de medicamentos.'
  if (/gracias/.test(t))
    return '¡De nada! Estoy para ayudarte cuando lo necesites.'
  if (/hola|buenas|buen d[ií]a/.test(t))
    return '¡Hola! ¿En qué te puedo ayudar hoy?'
  return 'Puedo ayudarte con turnos médicos, actividades de la semana y las noticias del día. ¿Sobre qué te gustaría saber?'
}

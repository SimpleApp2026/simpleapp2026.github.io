export interface Descuento { id: string; comercio: string; oferta: string; detalle: string }

export const DESCUENTOS: Descuento[] = [
  { id: 'farmacia', comercio: 'Farmacia del Barrio', oferta: '20% en medicamentos', detalle: 'Presentá tu cupón +Simple y obtené un 20% de descuento en medicamentos de venta libre, de lunes a viernes.' },
  { id: 'optica', comercio: 'Óptica Visión', oferta: '2x1 en anteojos de lectura', detalle: 'Llevá dos pares de anteojos de lectura al precio de uno. Válido durante todo el mes.' },
  { id: 'cafe', comercio: 'Café Las Violetas', oferta: '15% en la merienda', detalle: 'Disfrutá la merienda completa con un 15% de descuento presentando tu perfil de +Simple.' },
  { id: 'sorteo', comercio: 'Sorteo mensual', oferta: 'Participá por una tarde de spa', detalle: 'Todos los meses sorteamos una tarde de spa entre los miembros de la comunidad. ¡Participá gratis!' },
]

export function getDescuento(id: string): Descuento | undefined {
  return DESCUENTOS.find((d) => d.id === id)
}
